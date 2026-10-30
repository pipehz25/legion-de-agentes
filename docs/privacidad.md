# Política de privacidad — Legión de Agentes I.A

Última actualización: octubre de 2026.

Legión de Agentes I.A es una herramienta interna que sus administradores usan para enviar clips de video a sus propias cuentas de TikTok y de otras redes sociales.

- **Qué datos usa.** Al autorizar la app, TikTok entrega un identificador de la cuenta (open_id) y tokens de acceso y de renovación. Los permisos que se piden son `user.info.basic`, para la información básica del perfil, y `video.upload` y `video.publish`, para enviar videos.
- **Para qué.** Solo para enviar a esa misma cuenta los videos que aprueban sus administradores y para consultar el estado de cada envío.
- **Dónde se guardan.** Solo en el equipo del titular de la cuenta, en un archivo local fuera del repositorio. El proyecto no tiene servidores ni bases de datos.
- **Con quién se comparten.** Con nadie. No se venden ni se usan para publicidad. Solo viajan a TikTok cuando se llama a su API.
- **Conservación y borrado.** Se conservan hasta que el titular retire el acceso desde los ajustes de seguridad de TikTok o borre el archivo local. Al retirar el acceso, los tokens dejan de servir.
- **Menores.** La herramienta no está dirigida a menores de edad.
- **Contacto.** https://github.com/pipehz25/legion-de-agentes/issues

Ver también los [términos de servicio](terminos.md).
