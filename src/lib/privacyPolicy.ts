import {
  AGENCIA_LOCATION,
  AGENCIA_NAME,
  WHATSAPP_DISPLAY,
  whatsappUrl,
} from "./whatsapp";

export const PRIVACY_POLICY_LAST_UPDATED = "15 de junio de 2026";
export const SITE_DOMAIN = "sistemataup.online";
export const GA_MEASUREMENT_ID = "G-7BNVXG0TV0";

export const privacyDataRequestMessage =
  "Hola, me contacto en relación a mis datos personales según la Ley 25.326 (Protección de Datos Personales). Solicito ejercer mis derechos de acceso, rectificación o supresión sobre la información que Agencia TA pueda tener sobre mí en relación con Point Once.";

export const privacyDataRequestUrl = whatsappUrl(privacyDataRequestMessage);

export interface PrivacySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PrivacyPolicyContent {
  siteName: string;
  sitePath: string;
  sections: PrivacySection[];
}

export const privacyPolicyContent: PrivacyPolicyContent = {
  siteName: "Point Once",
  sitePath: "https://sistemataup.online/point/",
  sections: [
    {
      title: "1. Responsable del tratamiento",
      paragraphs: [
        `${AGENCIA_NAME}, con domicilio en ${AGENCIA_LOCATION}, es responsable del tratamiento de los datos personales recabados a través del sitio web Point Once en ${SITE_DOMAIN}/point/ (en adelante, el «Sitio»).`,
        "Al utilizar el Sitio o contactarnos, usted acepta las prácticas descritas en esta Política de Privacidad.",
      ],
    },
    {
      title: "2. Datos que recopilamos",
      paragraphs: [
        "Podemos recopilar las siguientes categorías de información:",
      ],
      bullets: [
        "Datos de contacto que usted nos proporciona voluntariamente al iniciar una conversación por WhatsApp (por ejemplo: nombre, comercio y consultas sobre productos o combos).",
        "Datos técnicos de navegación generados automáticamente al visitar el Sitio (dirección IP, tipo de navegador, sistema operativo, páginas visitadas, duración de la visita y origen de referencia).",
        "Datos recopilados mediante cookies y tecnologías similares utilizadas por Google Analytics para medir el uso del Sitio.",
      ],
    },
    {
      title: "3. Finalidad del tratamiento",
      paragraphs: [
        "Utilizamos sus datos personales para las siguientes finalidades:",
      ],
      bullets: [
        "Responder consultas sobre Point Once, combos, stock y licencias.",
        "Coordinar la implementación del sistema de caja en su comercio.",
        "Analizar el tráfico y el comportamiento de los visitantes para mejorar la experiencia y el contenido del Sitio.",
        "Realizar mediciones estadísticas y de marketing digital.",
      ],
    },
    {
      title: "4. Base legal",
      paragraphs: [
        "El tratamiento se realiza conforme a la Ley N.º 25.326 de Protección de Datos Personales de la República Argentina y normativa complementaria.",
        "En particular, nos basamos en su consentimiento al contactarnos, en nuestro interés legítimo de mejorar el Sitio y en el cumplimiento de obligaciones legales aplicables.",
      ],
    },
    {
      title: "5. Contacto por WhatsApp",
      paragraphs: [
        "Los botones y enlaces de contacto del Sitio abren una conversación en WhatsApp con el número " +
          WHATSAPP_DISPLAY +
          ". No almacenamos en servidores propios el contenido de esos mensajes antes de que usted los envíe.",
        "A partir de ese momento, el tratamiento de los mensajes también queda sujeto a las políticas de privacidad de WhatsApp (Meta Platforms, Inc.). Recomendamos no incluir datos sensibles innecesarios en su mensaje.",
      ],
    },
    {
      title: "6. Cookies, consentimiento y Google Analytics",
      paragraphs: [
        "Al ingresar al Sitio se muestra un banner de consentimiento de cookies provisto por Cookie Script (https://cookie-script.com/), que le permite aceptar, rechazar o personalizar las categorías de cookies. Las cookies no esenciales (incluidas las de análisis) solo se activan si usted otorga su consentimiento.",
        `El Sitio utiliza Google Analytics 4 (ID de medición: ${GA_MEASUREMENT_ID}), un servicio de análisis web provisto por Google LLC, integrado con Google Consent Mode v2. Hasta que usted acepte las cookies de análisis, Google Analytics opera en modo restringido sin almacenar cookies de identificación; tras su consentimiento, emplea cookies para recopilar información de uso de forma agregada.`,
        "Puede modificar su elección en cualquier momento desde el banner o el enlace de configuración de cookies del Sitio. También puede obtener más información en la política de privacidad de Google: https://policies.google.com/privacy, o instalar el complemento de inhabilitación para navegadores: https://tools.google.com/dlpage/gaoptout.",
      ],
    },
    {
      title: "7. Cesión y transferencia a terceros",
      paragraphs: [
        "No vendemos ni alquilamos sus datos personales. Podemos compartir información limitada con los siguientes encargados de tratamiento, únicamente para las finalidades indicadas:",
      ],
      bullets: [
        "Cookie Script (UAB „CookieScript“, Lituania): gestión del banner de consentimiento de cookies.",
        "Google LLC (Google Analytics): análisis de tráfico web.",
        "Meta Platforms, Inc. (WhatsApp): comunicación y atención de consultas iniciadas por el usuario.",
      ],
    },
    {
      title: "8. Conservación de los datos",
      paragraphs: [
        "Conservamos los datos de contacto el tiempo necesario para atender su consulta y mantener la relación comercial, y los datos analíticos según los plazos configurados en Google Analytics o hasta que retire su consentimiento cuando corresponda.",
      ],
    },
    {
      title: "9. Sus derechos",
      paragraphs: [
        "De acuerdo con la Ley 25.326, usted tiene derecho a acceder, rectificar, actualizar y suprimir sus datos personales, así como a oponerse al tratamiento cuando corresponda.",
        "La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender denuncias y reclamos relacionados con el tratamiento de datos personales.",
      ],
    },
    {
      title: "10. Seguridad",
      paragraphs: [
        "Adoptamos medidas técnicas y organizativas razonables para proteger la información contra acceso no autorizado, pérdida o alteración. Ningún sistema en Internet puede garantizar seguridad absoluta.",
      ],
    },
    {
      title: "11. Contacto para ejercer sus derechos",
      paragraphs: [
        `Para consultas sobre esta política o para ejercer sus derechos de protección de datos, puede contactarnos por WhatsApp al ${WHATSAPP_DISPLAY}.`,
      ],
    },
    {
      title: "12. Cambios en esta política",
      paragraphs: [
        "Podemos actualizar esta Política de Privacidad para reflejar cambios legales o en nuestros servicios. Publicaremos la versión vigente en esta página con la fecha de última actualización.",
      ],
    },
  ],
};
