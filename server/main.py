"""API mínima: guarda respuestas del diagnóstico en SQLite local."""

from __future__ import annotations

import hashlib
import json
import os
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from collections.abc import AsyncIterator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

DATA_DIR = Path(os.getenv("DIAGNOSTICO_DATA_DIR", Path(__file__).resolve().parent / "data"))
DB_PATH = Path(os.getenv("DIAGNOSTICO_DB_PATH", DATA_DIR / "diagnostico.sqlite3"))

ALLOWED_REGISTRO = {
    "Sistema de punto de venta",
    "Excel / Google Sheets",
    "Cuaderno / papel",
    "Caja registradora",
    "No llevo un registro detallado",
}
ALLOWED_USA_SISTEMA = {"Sí", "No", "Uso varias herramientas separadas"}
ALLOWED_FACILITA = {
    "Sí, mucho",
    "Cumple lo básico",
    "Poco",
    "Me genera más trabajo",
    "No uso sistema",
}
ALLOWED_CONTROL = {
    "Ventas",
    "Stock",
    "Caja",
    "Gastos",
    "Rentabilidad",
    "Productos y precios",
    "Empleados",
    "Todo está bastante controlado",
}
ALLOWED_MARGEN = {"Sí", "Aproximadamente", "No", "Nunca lo calculé"}

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS diagnostico_respuestas (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  registro_ventas   TEXT NOT NULL,
  usa_sistema       TEXT NOT NULL,
  facilita_trabajo  TEXT NOT NULL,
  cuestan_control   TEXT NOT NULL,
  margen_producto   TEXT NOT NULL,
  mejorar_hoy       TEXT NOT NULL,
  nombre            TEXT NOT NULL,
  comercio          TEXT NOT NULL,
  whatsapp          TEXT NOT NULL,
  source            TEXT NOT NULL DEFAULT 'point_diagnostico',
  user_agent        TEXT,
  ip_hash           TEXT
);
CREATE INDEX IF NOT EXISTS idx_diagnostico_created_at
  ON diagnostico_respuestas (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostico_whatsapp
  ON diagnostico_respuestas (whatsapp);
"""


class DiagnosticoIn(BaseModel):
    registro_ventas: str
    usa_sistema: str
    facilita_trabajo: str
    cuestan_control: list[str] = Field(default_factory=list, min_length=1)
    margen_producto: str
    mejorar_hoy: str = Field(min_length=3, max_length=2000)
    nombre: str = Field(min_length=2, max_length=120)
    comercio: str = Field(min_length=2, max_length=160)
    whatsapp: str = Field(min_length=8, max_length=40)

    @field_validator("registro_ventas")
    @classmethod
    def _v_registro(cls, value: str) -> str:
        if value not in ALLOWED_REGISTRO:
            raise ValueError("opción inválida")
        return value

    @field_validator("usa_sistema")
    @classmethod
    def _v_usa(cls, value: str) -> str:
        if value not in ALLOWED_USA_SISTEMA:
            raise ValueError("opción inválida")
        return value

    @field_validator("facilita_trabajo")
    @classmethod
    def _v_facilita(cls, value: str) -> str:
        if value not in ALLOWED_FACILITA:
            raise ValueError("opción inválida")
        return value

    @field_validator("cuestan_control")
    @classmethod
    def _v_control(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item.strip()]
        if not cleaned:
            raise ValueError("elegí al menos una opción")
        if any(item not in ALLOWED_CONTROL for item in cleaned):
            raise ValueError("opción inválida")
        return cleaned

    @field_validator("margen_producto")
    @classmethod
    def _v_margen(cls, value: str) -> str:
        if value not in ALLOWED_MARGEN:
            raise ValueError("opción inválida")
        return value

    @field_validator("nombre", "comercio", "mejorar_hoy")
    @classmethod
    def _strip_text(cls, value: str) -> str:
        cleaned = " ".join(value.split())
        if not cleaned:
            raise ValueError("requerido")
        return cleaned

    @field_validator("whatsapp")
    @classmethod
    def _v_whatsapp(cls, value: str) -> str:
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 8 or len(digits) > 15:
            raise ValueError("WhatsApp inválido")
        return digits


class DiagnosticoOut(BaseModel):
    id: int
    ok: bool = True


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_schema() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA_SQL)
        conn.commit()


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    ensure_schema()
    yield


app = FastAPI(title="Point Diagnóstico API", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str | bool]:
    try:
        with connect() as conn:
            conn.execute("SELECT 1").fetchone()
        return {"status": "ok", "db": str(DB_PATH), "sqlite": True}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=503, detail=f"db down: {exc}") from exc


@app.post("/diagnostico", response_model=DiagnosticoOut)
def create_diagnostico(payload: DiagnosticoIn, request: Request) -> DiagnosticoOut:
    ua = (request.headers.get("user-agent") or "")[:500]
    client_ip = request.client.host if request.client else ""
    ip_hash = (
        hashlib.sha256(client_ip.encode("utf-8")).hexdigest()[:32] if client_ip else None
    )

    try:
        with connect() as conn:
            cur = conn.execute(
                """
                INSERT INTO diagnostico_respuestas (
                    registro_ventas,
                    usa_sistema,
                    facilita_trabajo,
                    cuestan_control,
                    margen_producto,
                    mejorar_hoy,
                    nombre,
                    comercio,
                    whatsapp,
                    user_agent,
                    ip_hash
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    payload.registro_ventas,
                    payload.usa_sistema,
                    payload.facilita_trabajo,
                    json.dumps(payload.cuestan_control, ensure_ascii=False),
                    payload.margen_producto,
                    payload.mejorar_hoy,
                    payload.nombre,
                    payload.comercio,
                    payload.whatsapp,
                    ua or None,
                    ip_hash,
                ),
            )
            conn.commit()
            row_id = int(cur.lastrowid or 0)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"No se pudo guardar: {exc}") from exc

    if row_id <= 0:
        raise HTTPException(status_code=500, detail="Insert sin id")
    return DiagnosticoOut(id=row_id)
