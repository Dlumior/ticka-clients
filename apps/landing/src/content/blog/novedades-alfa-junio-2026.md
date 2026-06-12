---
title: 'Lo nuevo en el alfa: del correo de tu cliente a un CSV listo para tu sistema'
description: 'El alfa de Ticka ya recorre el camino completo de un comprobante: llega por correo o subida manual, se extraen sus datos automáticamente, pasa por tu revisión y sale como un CSV con las columnas de tu sistema contable.'
pubDate: '2026-06-12'
---

Cuando empezamos Ticka, la promesa era simple de decir y difícil de cumplir: que un comprobante viaje desde el correo de tu cliente hasta tu sistema contable **sin que nadie lo tipee**. Hoy el alfa ya recorre ese camino completo. Esto es lo que hay de nuevo.

## Una bandeja de entrada con correo propio

Cada workspace de Ticka tiene ahora su **propia dirección de correo**. Funciona así: creas un workspace para tu cliente — por ejemplo, `ws-estudio-garcia@ticka.pe` — y le pides que reenvíe ahí sus facturas, o configuras un reenvío automático desde su buzón.

Cada correo que llega queda registrado en la bandeja del workspace, con su remitente, asunto y adjuntos. Guardamos siempre el **correo original completo**, así que nunca pierdes el respaldo de lo que llegó. Los duplicados se detectan solos: si el mismo archivo llega dos veces, Ticka lo marca y no lo procesa de nuevo.

¿Y si el comprobante no llegó por correo? La misma bandeja acepta **subida manual**: arrastra archivos XML o PDF (hasta 10 MB cada uno) y entran al mismo flujo.

Para más adelante: estamos preparando el ingreso de comprobantes por **WhatsApp y Telegram**, para que la foto de una boleta tomada en campo también llegue sola.

## Extracción automática de datos

Aquí está el corazón de Ticka. Cada XML o PDF que entra se procesa automáticamente y se convierte en un comprobante estructurado:

- **Tipos de documento**: factura, boleta, nota de crédito y nota de débito.
- **Datos del emisor**: razón social y RUC.
- **Detalle económico**: subtotal, IGV, total y cada línea de detalle con su cantidad y precio.
- **Identificación**: serie, correlativo y fecha de emisión.

Nada de esto requiere que abras el documento y copies cifras a mano.

## Un flujo de revisión que respeta tu criterio

La automatización no significa perder el control. Cada comprobante avanza por estados claros:

> Recibido → Procesado → Requiere revisión → Aprobado → Exportado

Si Ticka tiene dudas sobre algún dato, el comprobante queda en **“requiere revisión”** y espera tu ojo. Nada se aprueba ni se exporta sin pasar por ti. La lista de comprobantes te deja filtrar por estado, tipo y proveedor, así sabes exactamente qué falta revisar antes del cierre.

## Mesa de trabajo: de aprobados a CSV en minutos

La novedad más grande de este ciclo. La **mesa de trabajo** es donde conviertes comprobantes aprobados en archivos listos para tu sistema:

1. Filtra por proveedor, periodo o estado.
2. Selecciona comprobantes completos — o **líneas de detalle individuales**, si tu registro lo necesita.
3. Elige una **plantilla CSV** y descarga.

Las plantillas son tuyas: defines qué columnas lleva el archivo y en qué orden, para que coincida exactamente con lo que tu software contable espera al importar. Si la plantilla incluye campos de línea, el CSV sale con una fila por línea de detalle. Cada exportación queda registrada en un **historial**, así siempre sabes qué se exportó, cuándo y con qué plantilla.

## Proveedores que se registran solos

Cada comprobante procesado alimenta el **directorio de proveedores** del workspace, identificados por su RUC. Puedes completar datos de contacto, ver todas las facturas de un mismo proveedor y usarlo como filtro en la mesa de trabajo. Sin mantener padrones a mano.

## Pensado para estudios, no solo para una empresa

Ticka se organiza igual que tu práctica:

- **Organizaciones** para tu estudio.
- **Workspaces** independientes por cada cliente, cada uno con su correo y sus comprobantes.
- **Roles y permisos** (owner, admin, member, viewer) para que cada miembro del equipo vea y haga solo lo que le corresponde.
- **Invitaciones** por correo para sumar a tu equipo en minutos.

## Seguimos en alfa — y quedan cupos

Todo esto está vivo y funcionando, pero seguimos en **alfa privada**: trabajamos de cerca con un grupo pequeño de estudios contables peruanos y afinamos el producto con sus casos reales. Eso significa que las cosas mejoran rápido — y que tu opinión todavía puede cambiar lo que construimos.

Si quieres procesar tus comprobantes con Ticka, [solicita tu acceso aquí](/#contacto). Respondemos cada solicitud personalmente.
