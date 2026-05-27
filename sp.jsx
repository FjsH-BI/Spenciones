import { useState } from "react";

const TABS = ["📋 Visión General", "💰 Saldos", "⚠️ Deudas", "🔗 Relaciones Clave", "🔍 Diagnóstico de Errores"];

const data = {
  overview: {
    title: "¿Qué es la BDA?",
    desc: "Informe mensual que cada AFP envía a la Superintendencia de Pensiones. Consolida TODA la información previsional: personas, cuentas, saldos, movimientos, bonos, pensionados, fallecidos, beneficiarios, deudas y rezagos.",
    archivos: [
      { n: 1, pre: "PERS", nom: "Personas", desc: "Archivo maestro. Contiene TODOS los afiliados con cuenta, pensionados y fallecidos. Es la base para validar el resto.", tipo: "maestro" },
      { n: 2, pre: "BONO", nom: "Bonos de Reconocimiento", desc: "Bonos emitidos o en trámite: valores, estados, visación, liquidación.", tipo: "bono" },
      { n: 3, pre: "DABR", nom: "Datos adicionales Bono transado/cedido", desc: "Info adicional de bonos transados: monto, TIR, compañía, bolsa, fechas.", tipo: "bono" },
      { n: 4, pre: "CTAS", nom: "Cuentas Personales", desc: "Saldos en cuotas y pesos por RUN, tipo de cuenta, fondo y subcuenta. Control patrimonial central.", tipo: "saldo" },
      { n: 5, pre: "SCAI", nom: "Saldos por Empleador (CAI)", desc: "Subsaldos de Cuenta de Ahorro de Indemnización por empleador, fondo, fechas laborales y pactos.", tipo: "saldo" },
      { n: 6, pre: "SCCV", nom: "Saldos de CCICV", desc: "Saldos de cotizaciones voluntarias por régimen tributario, fondo y bonificación estatal.", tipo: "saldo" },
      { n: 7, pre: "SPVC", nom: "Saldos por Empleador APVC", desc: "Saldos APVC por plan, régimen tributario, trabajador, empleador, fondo y vigencia.", tipo: "saldo" },
      { n: 8, pre: "SBEP", nom: "Saldos Bonificación Estatal APVC", desc: "Saldos de bonificación estatal APVC por afiliado y fondo.", tipo: "saldo" },
      { n: 9, pre: "PPVC", nom: "Planes de APVC", desc: "Planes APVC suscritos por empleadores: vigencia, fechas, glosa.", tipo: "plan" },
      { n: 10, pre: "MCCI", nom: "Movimientos Cuentas Personales", desc: "Todos los cargos y abonos del mes: empleador, fechas, código movimiento, pesos, cuotas, valor cuota y saldo posterior.", tipo: "movimiento" },
      { n: 11, pre: "CDTF", nom: "Cambios/distribuciones/traspasos futuros", desc: "Cambios de fondo, asignaciones, distribuciones de saldos y traspasos futuros.", tipo: "movimiento" },
      { n: 12, pre: "AFPI", nom: "Afiliados pensionados por invalidez", desc: "Dictámenes, tipo de invalidez, modalidad, fechas, cobertura, montos, SCOMP, PAFE y saldos.", tipo: "pension" },
      { n: 13, pre: "CNUA", nom: "CNU de afiliados", desc: "Capital Necesario Unitario al pensionarse o fallecer con sobrevivencia.", tipo: "pension" },
      { n: 14, pre: "AFPV", nom: "Afiliados pensionados por vejez", desc: "Solicitud, tipo de vejez, modalidad, montos, saldos, rebaja por trabajo pesado y SCOMP.", tipo: "pension" },
      { n: 15, pre: "CMVI", nom: "Cambios de modalidad vejez/invalidez", desc: "Cambios de modalidad, fechas, modalidad seleccionada y prima traspasada.", tipo: "pension" },
      { n: 16, pre: "PPVI", nom: "Pagos pensionados vejez/invalidez/ET", desc: "Pagos mensuales, tipo de pago, beneficios, excedentes, APS/PGU, RP real/nocional y montos.", tipo: "pension" },
      { n: 17, pre: "AFAL", nom: "Afiliados Fallecidos", desc: "Fecha de fallecimiento, situación al fallecer, saldos, cobertura, herencia, cuota mortuoria y sobrevivencia.", tipo: "fallecido" },
      { n: 18, pre: "AFPS", nom: "Fallecidos que causaron sobrevivencia", desc: "Pensión de referencia, aporte adicional, modalidad y fechas de pago.", tipo: "fallecido" },
      { n: 19, pre: "PBPS", nom: "Pagos beneficiarios sobrevivencia", desc: "Pagos a beneficiarios: porcentaje, tipo de pago, beneficios, región, país y montos.", tipo: "pension" },
      { n: 20, pre: "CMGF", nom: "Cambios modalidad grupo familiar", desc: "Cambios de modalidad de pensión del grupo familiar del fallecido.", tipo: "pension" },
      { n: 21, pre: "RVVI", nom: "Rentas vitalicias vejez/invalidez", desc: "Tipo de RV, monto, compañía, prima, comisión, póliza y endoso.", tipo: "pension" },
      { n: 22, pre: "RVPS", nom: "Rentas vitalicias beneficiarios sobrevivencia", desc: "RV por beneficiario: pensión, prima, comisión y póliza.", tipo: "pension" },
      { n: 23, pre: "RVGF", nom: "Rentas vitalicias sobrevivencia grupo familiar", desc: "RV por grupo familiar, compañía, prima, prima unitaria, meses garantizados y diferimiento.", tipo: "pension" },
      { n: 24, pre: "ANVI", nom: "Anualidad RP o RT vejez/invalidez", desc: "Cálculo/recálculo de anualidad: saldos considerados, monto fórmula, monto a retirar y factor de ajuste.", tipo: "pension" },
      { n: 25, pre: "CNAN", nom: "CNU en cálculo de anualidad", desc: "CNU usado en cálculo o recálculo de anualidades de pensionados y sobrevivencia.", tipo: "pension" },
      { n: 26, pre: "ANGF", nom: "Anualidad RP o RT sobrevivencia grupo familiar", desc: "Cálculo anualidad sobrevivencia por grupo, saldos y tipo de retiro.", tipo: "pension" },
      { n: 27, pre: "ANPS", nom: "Anualidad RP o RT sobrevivencia por beneficiario", desc: "Monto por beneficiario, causal de cese, nacionalidad y factor de ajuste.", tipo: "pension" },
      { n: 28, pre: "BEPS", nom: "Beneficiarios pensión de sobrevivencia", desc: "Parentesco, invalidez, cese, fallecimiento, país y factor de ajuste.", tipo: "beneficiario" },
      { n: 29, pre: "PBES", nom: "Potenciales beneficiarios sobrevivencia", desc: "Beneficiarios potenciales de afiliados pensionados o fallecidos: datos personales y parentesco.", tipo: "beneficiario" },
      { n: 30, pre: "DCPC", nom: "Deudas Cotizaciones Previsionales (Carátulas)", desc: "Identificación general de deudas previsionales, origen, empleador, estado y montos.", tipo: "deuda" },
      { n: 31, pre: "DCRI", nom: "Deudas Cotizaciones Reconocidas (Detalle)", desc: "Detalle de involucrados asociados a deudas reconocidas.", tipo: "deuda" },
      { n: 32, pre: "DPRE", nom: "Deuda Presunta", desc: "Empleadores que no pagaron ni declararon cotizaciones de trabajadores.", tipo: "deuda" },
      { n: 33, pre: "CREZ", nom: "Cotizaciones en Rezago", desc: "Cotizaciones en rezago y recuperadas durante el mes: afiliado, empleador y causal.", tipo: "deuda" },
      { n: 34, pre: "CSIS", nom: "Compañías de Seguros SIS", desc: "Compañías que cubren siniestros de invalidez y sobrevivencia.", tipo: "seguro" },
      { n: 35, pre: "SPCI", nom: "Solicitudes pensión Convenios Internacionales", desc: "Solicitudes y concesiones bajo convenios internacionales, país, región y estado.", tipo: "internacional" },
      { n: 36, pre: "POCH", nom: "Pagos cuotas mortuorias y herencias", desc: "Pagos del mes por cuota mortuoria y herencia, montos y fechas.", tipo: "fallecido" },
      { n: 37, pre: "SETR", nom: "Solicitudes efectuadas por trabajadores", desc: "Solicitudes manuales/electrónicas que implican movimientos financieros.", tipo: "movimiento" },
      { n: 38, pre: "APET", nom: "Afiliados pensionados por enfermedad terminal", desc: "Datos de afiliados acogidos a pensión anticipada por enfermedad terminal.", tipo: "pension" },
      { n: 39, pre: "DCET", nom: "Detalle cálculo capital enfermedad terminal", desc: "Insumos para calcular capital necesario para pensiones de sobrevivencia por ET.", tipo: "pension" },
      { n: 40, pre: "CHFE", nom: "Pagos cuotas mortuorias herencias financiamiento estatal", desc: "Pagos financiados por el Estado por cuota mortuoria y herencias.", tipo: "fallecido" },
      { n: 41, pre: "EMCT", nom: "Empleadores que consignan en Tribunales", desc: "Empleadores con consignaciones judiciales históricas.", tipo: "deuda" },
      { n: 42, pre: "CPET", nom: "Consignaciones pagadas en Tribunales", desc: "Detalle de pagos judiciales y trazabilidad hasta fondos de pensiones.", tipo: "deuda" },
      { n: 43, pre: "RNIC", nom: "Stock ROL y NIC", desc: "Stock histórico de ROL y NIC otorgados por el sistema.", tipo: "identificador" },
      { n: 44, pre: "DCAF", nom: "Datos de contacto de afiliados", desc: "Datos de contacto registrados por afiliado y medio de contacto.", tipo: "contacto" },
    ]
  },
  saldos: {
    grupos: [
      {
        titulo: "💼 Cuentas Personales (CTAS)",
        prefijo: "ctas",
        campos: [
          { campo: "RUN persona", formato: "9(08)", nota: "Debe existir en PERS" },
          { campo: "Tipo de cuenta", formato: "9(01)", nota: "1=CCICO, 2=CAV, 3=CAI, 4=CCICV, 5=CCIDC, 6=CCIAV, 7=CAPVC" },
          { campo: "Tipo de fondo", formato: "X(01)", nota: "A, B, C, D o E" },
          { campo: "Saldo en cuotas", formato: "9(08)V9(04)", nota: "Saldo final = saldo mes anterior ± movimientos MCCI" },
          { campo: "Saldo en pesos", formato: "9(10)", nota: "Cuotas × valor cuota cierre último día hábil del mes" },
          { campo: "Tipo de subcuenta", formato: "9(02)", nota: "Ej: 11=CCICO obligatorio trabajador, 12=CCICO empleador" },
        ],
        regla: "El saldo final en cuotas debe cuadrar con Informes Diarios de la SP. El saldo en pesos = cuotas × valor cuota de cierre."
      },
      {
        titulo: "🏭 Saldos por Empleador CAI (SCAI)",
        prefijo: "scai",
        campos: [
          { campo: "RUN del trabajador", formato: "9(08)", nota: "Debe existir en PERS" },
          { campo: "RUT del empleador", formato: "9(08)", nota: "Válido módulo 11" },
          { campo: "Tipo de fondo", formato: "X(01)", nota: "A, B, C, D o E" },
          { campo: "Saldo en cuotas", formato: "9(08)V9(02)", nota: "Subsaldo mayor que cero" },
          { campo: "Saldo en pesos", formato: "9(10)", nota: "Cuotas × valor cuota cierre mes" },
          { campo: "Fecha inicio laboral", formato: "9(08)", nota: "Fecha inicio relación laboral con empleador" },
          { campo: "Fecha de pacto", formato: "9(08)", nota: "Fecha del pacto de indemnización" },
        ],
        regla: "Solo se informan subsaldos mayores que cero. El total de subsaldos por empleador debe sumar el saldo total de la CAI en CTAS."
      },
      {
        titulo: "📈 Saldos CCICV – Cotizaciones Voluntarias (SCCV)",
        prefijo: "sccv",
        campos: [
          { campo: "RUN del trabajador", formato: "9(08)", nota: "Debe existir en PERS" },
          { campo: "Régimen tributario", formato: "X(01)", nota: "Código de régimen tributario APV" },
          { campo: "Tipo de fondo", formato: "X(01)", nota: "A, B, C, D o E" },
          { campo: "Saldo en cuotas", formato: "9(08)V9(02)", nota: "Solo subsaldos > 0" },
          { campo: "Saldo en pesos", formato: "9(10)", nota: "Cuotas × valor cuota cierre último día hábil" },
          { campo: "Saldo cuotas bonificación estatal", formato: "9(08)V9(02)", nota: "Bonificación estado Art. 20L DL 3.500" },
          { campo: "Saldo pesos bonificación estatal", formato: "9(10)", nota: "Cuotas bonif. × valor cuota cierre" },
        ],
        regla: "Se informa por régimen tributario. La bonificación estatal se reporta separada del saldo del trabajador."
      },
      {
        titulo: "👥 Saldos por Empleador APVC (SPVC)",
        prefijo: "spvc",
        campos: [
          { campo: "RUN del trabajador", formato: "9(08)", nota: "Debe existir en PERS" },
          { campo: "RUT del empleador", formato: "9(08)", nota: "Empleador del plan APVC" },
          { campo: "Tipo de plan APVC", formato: "X(01)", nota: "Código del plan suscrito" },
          { campo: "Régimen tributario", formato: "X(01)", nota: "Código régimen tributario" },
          { campo: "Tipo de fondo", formato: "X(01)", nota: "A, B, C, D o E" },
          { campo: "Saldo afiliado en cuotas", formato: "9(08)V9(02)", nota: "Aporte del trabajador" },
          { campo: "Saldo afiliado en pesos", formato: "9(10)", nota: "Cuotas afiliado × valor cuota cierre" },
          { campo: "Saldo empleador en cuotas", formato: "9(08)V9(02)", nota: "Aporte del empleador" },
          { campo: "Saldo empleador en pesos", formato: "9(10)", nota: "Cuotas empleador × valor cuota cierre" },
        ],
        regla: "Se reportan separados el aporte del afiliado y del empleador. La suma debe coincidir con el saldo total en CTAS cuenta tipo 7 (CAPVC)."
      },
      {
        titulo: "🔄 Movimientos Cuentas Personales (MCCI)",
        prefijo: "mcci",
        campos: [
          { campo: "RUN del trabajador", formato: "9(08)", nota: "Debe existir en PERS" },
          { campo: "RUT del empleador", formato: "9(08)", nota: "Empleador que genera el movimiento" },
          { campo: "Fecha de operación", formato: "9(08) aaaammdd", nota: "Fecha solicitud/suscripción. Anterior o igual a fecha acreditación" },
          { campo: "Fecha de movimiento (acreditación)", formato: "9(08) aaaammdd", nota: "Fecha real de acreditación en cuenta" },
          { campo: "Código del movimiento", formato: "9(05)", nota: "Catálogo SP: 11001=cotización obligatoria dep., 21002=depósito CAV, etc." },
          { campo: "Monto en pesos", formato: "9(10)", nota: "Valor nominal de la operación" },
          { campo: "Monto en cuotas", formato: "9(06)V9(02)", nota: "Calculado con valor cuota operación" },
          { campo: "Valor cuota de la operación", formato: "9(06)V9(02)", nota: "Valor cuota del día de la operación" },
          { campo: "Período devengamiento remuneración", formato: "9(06) aaaamm", nota: "Mes al que corresponde la remuneración" },
          { campo: "Remuneración imponible (pesos)", formato: "9(08)", nota: "Base imponible declarada por empleador" },
          { campo: "Tipo de fondo", formato: "X(01)", nota: "A, B, C, D o E" },
          { campo: "Saldo cuotas posterior a la operación", formato: "9(08)V9(02)", nota: "Saldo acumulado tras cada movimiento del mes" },
        ],
        regla: "El saldo posterior al último movimiento del mes debe ser igual al saldo informado en CTAS. Cuadratura: CTAS mes anterior ± MCCI = CTAS mes actual."
      },
    ]
  },
  deudas: {
    grupos: [
      {
        titulo: "📋 Deudas Cotizaciones Previsionales – Carátulas (DCPC)",
        prefijo: "dcpc",
        desc: "Carátula resumen de cada deuda. Es la tabla madre de las deudas.",
        campos: [
          { campo: "N° serie único de la deuda", formato: "9(20)", nota: "ID único por AFP, vincula con DCRI" },
          { campo: "RUT del empleador deudor", formato: "9(08)", nota: "Empleador que generó la deuda" },
          { campo: "Origen de la deuda", formato: "X(03)", nota: "DNP, DNPA, BOL, etc." },
          { campo: "Estado de la deuda", formato: "X(02)", nota: "01=Vigente, 02=En cobranza judicial, 03=Pagada, etc." },
          { campo: "Monto total deuda", formato: "9(12)", nota: "Capital + reajuste + intereses + recargos" },
          { campo: "Monto pagado", formato: "9(12)", nota: "Lo que ya se ha abonado" },
          { campo: "Saldo nominal adeudado", formato: "9(12)", nota: "Monto total menos lo pagado" },
          { campo: "Tipo de cuenta", formato: "9(01)", nota: "Mismo catálogo CTAS: 1=CCICO, 2=CAV, etc." },
          { campo: "Fecha de determinación", formato: "9(08) aaaammdd", nota: "Cuando se reconoció la deuda" },
        ],
        regla: "Toda deuda en DCPC debe tener al menos un registro en DCRI (detalle de involucrados). Si no, es error de consistencia entre archivos."
      },
      {
        titulo: "👤 Deudas Cotizaciones Reconocidas – Detalle Involucrados (DCRI)",
        prefijo: "dcri",
        desc: "Detalle trabajador a trabajador de qué debe cada empleador.",
        campos: [
          { campo: "N° serie único de la deuda", formato: "9(20)", nota: "Debe coincidir con N° en DCPC" },
          { campo: "Tipo de cuenta de la deuda", formato: "9(01)", nota: "Mismo catálogo CTAS" },
          { campo: "RUN del involucrado", formato: "9(08)", nota: "Trabajador afectado por la deuda" },
          { campo: "Monto total remuneración imponible", formato: "9(09)", nota: "Valor nominal. Cotización debe ser menor que esta" },
          { campo: "Monto total de la cotización", formato: "9(09)", nota: "Nominal. Debe ser < remuneración imponible" },
          { campo: "Monto reajuste", formato: "9(09)", nota: "Actualizado al último día del mes según tabla SP" },
          { campo: "Monto intereses", formato: "9(10)", nota: "Actualizado al último día del mes según tabla SP" },
          { campo: "Monto recargo fondo", formato: "9(09)", nota: "Actualizado al último día del mes" },
          { campo: "Monto abonado a la deuda", formato: "9(10)", nota: "Pagos parciales realizados" },
          { campo: "Saldo nominal adeudado", formato: "9(10)", nota: "Cotización nominal menos abonos" },
        ],
        regla: "El RUN del involucrado debe existir en PERS. La suma de saldos de DCRI por N° serie debe cuadrar con el saldo en DCPC."
      },
      {
        titulo: "❓ Deuda Presunta (DPRE)",
        prefijo: "dpre",
        desc: "Empleadores que NO pagaron NI declararon cotizaciones del tercer mes anterior.",
        campos: [
          { campo: "RUT del empleador", formato: "9(08)", nota: "Empleador en incumplimiento" },
          { campo: "RUN del afiliado", formato: "9(08)", nota: "Trabajador afectado" },
          { campo: "Tipo de cuenta", formato: "X(01)", nota: "Mismo catálogo CTAS" },
          { campo: "Período de devengamiento", formato: "9(06) aaaamm", nota: "Tercer mes anterior al mes informado" },
          { campo: "Remuneración imponible", formato: "9(09)", nota: "Estimada si no declaró" },
          { campo: "Monto nominal cotización", formato: "9(09)", nota: "Monto estimado en pesos" },
          { campo: "Fecha determinación deuda presunta", formato: "9(08) aaaammdd", nota: "Cuando la AFP detectó el incumplimiento" },
          { campo: "Estado de la deuda presunta", formato: "9(02)", nota: "01=Aclarada empleador, 02=Reconocida, 03=Pagada, 04=Regularizada AFP, 05=DNPA, 06=Vigente" },
        ],
        regla: "Se exige que no exista aviso de término o suspensión laboral que justifique el no pago. Si el estado pasa a 05, debe aparecer como DNPA en DCPC."
      },
      {
        titulo: "⏰ Cotizaciones en Rezago (CREZ)",
        prefijo: "crez",
        desc: "Cotizaciones que no se abonaron a tiempo en la cuenta del afiliado.",
        campos: [
          { campo: "RUN del afiliado", formato: "9(08)", nota: "Debe existir en PERS" },
          { campo: "RUT del empleador", formato: "9(08)", nota: "Empleador que pagó fuera de plazo" },
          { campo: "Tipo de cuenta", formato: "9(01)", nota: "Mismo catálogo CTAS" },
          { campo: "Período de devengamiento", formato: "9(06) aaaamm", nota: "Mes al que corresponde la cotización atrasada" },
          { campo: "Monto en rezago (pesos)", formato: "9(09)", nota: "Valor nominal de la cotización en rezago" },
          { campo: "Estado del rezago", formato: "X(02)", nota: "Vigente o Recuperado en el mes" },
          { campo: "Causal del rezago", formato: "X(02)", nota: "Código de causal según catálogo SP" },
        ],
        regla: "Si una cotización está en CREZ, NO debe estar abonada en MCCI de ese mes. Cuando se recupera, aparece en MCCI y se marca como recuperada en CREZ."
      },
    ]
  },
  relaciones: {
    principales: [
      {
        desde: "PERS",
        hacia: "TODOS",
        regla: "El RUN/DV de Personas es la llave base. Cualquier RUN en cualquier otro archivo DEBE existir en PERS.",
        critico: true
      },
      {
        desde: "PERS",
        hacia: "CTAS",
        regla: "Todo RUN en Cuentas Personales debe estar en Personas, incluso si saldo es cero.",
        critico: true
      },
      {
        desde: "CTAS",
        hacia: "MCCI",
        regla: "Saldo CTAS mes actual = Saldo CTAS mes anterior ± todos los movimientos MCCI del mes (por RUN, cuenta y fondo).",
        critico: true
      },
      {
        desde: "PERS",
        hacia: "AFPI",
        regla: "Pensionados por invalidez deben existir en PERS con estado compatible (ej: código 02=vivo pensionado).",
        critico: false
      },
      {
        desde: "PERS",
        hacia: "AFPV",
        regla: "Pensionados por vejez deben cruzar por RUN/DV, fechas de afiliación y datos de pensión.",
        critico: false
      },
      {
        desde: "PERS",
        hacia: "AFAL",
        regla: "Fallecidos deben estar en PERS con código de estado compatible (03 o 04).",
        critico: true
      },
      {
        desde: "AFAL",
        hacia: "AFPS",
        regla: "Solo fallecidos que causaron pensión de sobrevivencia pasan a AFPS.",
        critico: false
      },
      {
        desde: "AFPS",
        hacia: "BEPS",
        regla: "Beneficiarios de sobrevivencia deben asociarse al RUN del causante (fallecido en AFPS).",
        critico: false
      },
      {
        desde: "BEPS",
        hacia: "PBPS",
        regla: "Pagos a beneficiarios deben corresponder a beneficiarios informados en BEPS.",
        critico: false
      },
      {
        desde: "AFPI/AFPV",
        hacia: "PPVI",
        regla: "Pagos mensuales (PPVI) deben corresponder a pensionados válidos en AFPI o AFPV.",
        critico: true
      },
      {
        desde: "AFPI/AFPV",
        hacia: "RVVI",
        regla: "Rentas vitalicias deben corresponder a pensionados por vejez o invalidez.",
        critico: false
      },
      {
        desde: "AFAL/AFPS",
        hacia: "RVPS/RVGF",
        regla: "Rentas vitalicias de sobrevivencia deben asociarse al causante y beneficiarios.",
        critico: false
      },
      {
        desde: "ANVI/ANGF/ANPS",
        hacia: "PPVI/PBPS",
        regla: "Las anualidades calculadas (RP o RT) deben respaldar los montos pagados.",
        critico: true
      },
      {
        desde: "BONO",
        hacia: "DABR",
        regla: "Solo bonos transados o cedidos requieren datos adicionales en DABR.",
        critico: false
      },
      {
        desde: "RVVI",
        hacia: "MCCI/DABR",
        regla: "La prima traspasada debe ser consistente con cargos en MCCI y, si aplica, bono cedido/transado en DABR.",
        critico: true
      },
      {
        desde: "DCPC",
        hacia: "DCRI",
        regla: "La carátula de deuda debe tener detalle de involucrados en DCRI.",
        critico: true
      },
      {
        desde: "EMCT",
        hacia: "CPET",
        regla: "Empleadores con consignaciones judiciales deben relacionarse con pagos judiciales en CPET.",
        critico: false
      },
    ]
  },
  errores: {
    tipicos: [
      {
        error: "RUN/DV inválido",
        ejemplo: "Módulo 11 incorrecto",
        prevencion: "Validar RUN y DV antes de generar archivos",
        codigo: "EE09 / 401",
        archivo: "Todos"
      },
      {
        error: "RUN inexistente en Personas",
        ejemplo: "Registro en CTAS, AFAL, AFPI sin RUN en PERS",
        prevencion: "Control maestro contra archivo PERS",
        codigo: "Coherencia",
        archivo: "CTAS, AFAL, AFPI, AFPV, BEPS, PBPS"
      },
      {
        error: "Código fuera de catálogo",
        ejemplo: "Estado, modalidad, tipo de pensión con valor no permitido",
        prevencion: "Parametrizar catálogos oficiales y bloquear valores no permitidos",
        codigo: "999 / EE08",
        archivo: "PERS, AFPI, AFPV, PPVI"
      },
      {
        error: "Fechas inválidas",
        ejemplo: "Fecha posterior al cierre del informe o anterior al rango permitido",
        prevencion: "Validación calendario y reglas por campo",
        codigo: "301 / EE01",
        archivo: "Todos los que tienen campos de fecha"
      },
      {
        error: "Inconsistencia de estado",
        ejemplo: "Persona viva con registro de fallecido, o pensionado sin evento asociado",
        prevencion: "Cruces automáticos PERS vs AFAL/AFPI/AFPV",
        codigo: "Coherencia",
        archivo: "PERS ↔ AFAL/AFPI/AFPV"
      },
      {
        error: "Situación de cuentas mal construida",
        ejemplo: "Campo de 7 dígitos en PERS no coincide con cuentas existentes en CTAS",
        prevencion: "Recalcular el campo desde cuentas efectivas en CTAS",
        codigo: "Coherencia",
        archivo: "PERS campo 31 ↔ CTAS"
      },
      {
        error: "Saldos no cuadran",
        ejemplo: "Saldo final CTAS ≠ saldo anterior + movimientos MCCI",
        prevencion: "Cuadratura mensual por RUN, cuenta y fondo",
        codigo: "Consistencia",
        archivo: "CTAS ↔ MCCI"
      },
      {
        error: "Registro duplicado",
        ejemplo: "Misma combinación de llave repetida en el archivo",
        prevencion: "Definir llaves únicas por archivo y validar antes de transmitir",
        codigo: "Coherencia",
        archivo: "Todos"
      },
      {
        error: "Campos obligatorios en cero o blanco",
        ejemplo: "Fechas, montos o indicadores omitidos cuando son exigibles",
        prevencion: "Reglas condicionales por tipo de pensión, modalidad y evento",
        codigo: "EE10 / EE12",
        archivo: "Todos los que tienen campos condicionales"
      },
      {
        error: "País/Región inconsistente",
        ejemplo: "País distinto de Chile con región distinta de 00",
        prevencion: "Regla automática país-región",
        codigo: "Consistencia",
        archivo: "PERS, BEPS, SPCI"
      },
      {
        error: "Prima RV inconsistente",
        ejemplo: "RVVI no cuadra con cargos en MCCI o bono en DABR",
        prevencion: "Conciliación de prima, UF, movimientos y bono",
        codigo: "Consistencia",
        archivo: "RVVI ↔ MCCI/DABR"
      },
      {
        error: "Beneficiario sin causante",
        ejemplo: "BEPS/PBPS sin AFPS/AFAL asociado",
        prevencion: "Validación jerárquica causante-beneficiario",
        codigo: "Coherencia",
        archivo: "BEPS/PBPS ↔ AFPS/AFAL"
      },
    ],
    codigos: [
      { cod: "EE01", desc: "Largo incorrecto" },
      { cod: "EE02", desc: "Tipo de registro incorrecto" },
      { cod: "EE03", desc: "RUT AFP incorrecto" },
      { cod: "EE04", desc: "Prefijo incorrecto" },
      { cod: "EE05", desc: "Período incorrecto" },
      { cod: "EE06", desc: "Número de registros incorrecto" },
      { cod: "EE07", desc: "Caracteres incorrectos" },
      { cod: "EE08", desc: "Dato no numérico" },
      { cod: "EE09", desc: "Dígito verificador incorrecto" },
      { cod: "EE10", desc: "Valor en cero cuando no corresponde" },
      { cod: "EE12", desc: "Valor en blanco cuando no corresponde" },
      { cod: "301", desc: "Fecha incorrecta" },
      { cod: "401", desc: "Dígito verificador incorrecto (DV)" },
      { cod: "999", desc: "Código incorrecto (fuera de catálogo)" },
    ]
  }
};

const tipoColor = {
  maestro: "#6366f1",
  bono: "#f59e0b",
  saldo: "#10b981",
  movimiento: "#3b82f6",
  plan: "#8b5cf6",
  pension: "#ec4899",
  fallecido: "#6b7280",
  beneficiario: "#14b8a6",
  deuda: "#ef4444",
  seguro: "#0ea5e9",
  internacional: "#a855f7",
  identificador: "#84cc16",
  contacto: "#fb923c",
};

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [filterTipo, setFilterTipo] = useState("todos");

  const tipos = ["todos", ...Object.keys(tipoColor)];

  const filteredArchivos = data.overview.archivos.filter(a => {
    const matchSearch = search === "" ||
      a.nom.toLowerCase().includes(search.toLowerCase()) ||
      a.pre.toLowerCase().includes(search.toLowerCase()) ||
      a.desc.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === "todos" || a.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderBottom: "1px solid #334155", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ background: "#3b82f6", borderRadius: 8, padding: "6px 10px", fontSize: 20 }}>📊</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Guía BDA – Base de Datos de Afiliados</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Superintendencia de Pensiones · 44 archivos · Anexos I, II y III</p>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 16, flexWrap: "wrap" }}>
            {TABS.map((t, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeTab === i ? "#3b82f6" : "#1e293b",
                color: activeTab === i ? "#fff" : "#94a3b8",
                transition: "all 0.2s"
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* TAB 0 – VISIÓN GENERAL */}
        {activeTab === 0 && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #334155" }}>
              <h2 style={{ margin: "0 0 10px", fontSize: 16, color: "#93c5fd" }}>¿Qué es la BDA?</h2>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>{data.overview.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
                {[
                  { label: "¿Quién envía?", val: "Cada AFP" },
                  { label: "¿A quién?", val: "Superintendencia de Pensiones" },
                  { label: "¿Cuándo?", val: "Mensualmente (aaaamm)" },
                  { label: "¿Cómo?", val: "Transmisión electrónica" },
                  { label: "Total archivos", val: "44 archivos de datos" },
                ].map((d, i) => (
                  <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: 12, border: "1px solid #334155" }}>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{d.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar archivo..." style={{
                background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px",
                color: "#e2e8f0", fontSize: 13, outline: "none", flex: "1 1 200px"
              }} />
              <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} style={{
                background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px",
                color: "#e2e8f0", fontSize: 13, outline: "none"
              }}>
                {tipos.map(t => <option key={t} value={t}>{t === "todos" ? "Todos los tipos" : t}</option>)}
              </select>
              <span style={{ fontSize: 12, color: "#64748b" }}>{filteredArchivos.length} archivos</span>
            </div>

            {/* Grid archivos */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {filteredArchivos.map(a => (
                <div key={a.n} onClick={() => setExpandedCard(expandedCard === a.n ? null : a.n)} style={{
                  background: "#1e293b", borderRadius: 10, padding: 14, border: `1px solid ${expandedCard === a.n ? tipoColor[a.tipo] : "#334155"}`,
                  cursor: "pointer", transition: "all 0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ background: tipoColor[a.tipo] + "22", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: tipoColor[a.tipo], fontWeight: 700, whiteSpace: "nowrap" }}>
                      {a.pre}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{a.n}. {a.nom}</div>
                      {expandedCard === a.n && (
                        <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                          {a.desc}
                          <div style={{ marginTop: 6 }}>
                            <span style={{ background: tipoColor[a.tipo] + "33", color: tipoColor[a.tipo], borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{a.tipo}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1 – SALDOS */}
        {activeTab === 1 && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #334155" }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
                💡 <strong style={{ color: "#10b981" }}>Regla fundamental de saldos:</strong> El saldo en CTAS al cierre del mes = Saldo CTAS mes anterior ± todos los movimientos en MCCI del mes, por RUN + tipo de cuenta + tipo de fondo. Si no cuadra, el error está en MCCI o en el saldo inicial de CTAS.
              </p>
            </div>
            {data.saldos.grupos.map((g, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #334155" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 15, color: "#f1f5f9" }}>{g.titulo}</h3>
                <div style={{ fontSize: 12, background: "#0f172a", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#fbbf24", border: "1px solid #422006" }}>
                  ⚡ Regla clave: {g.regla}
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#0f172a" }}>
                        {["Campo", "Formato", "Notas"].map(h => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #334155" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.campos.map((c, j) => (
                        <tr key={j} style={{ borderBottom: "1px solid #1e293b" }}>
                          <td style={{ padding: "8px 12px", color: "#e2e8f0", fontWeight: 500 }}>{c.campo}</td>
                          <td style={{ padding: "8px 12px", color: "#38bdf8", fontFamily: "monospace" }}>{c.formato}</td>
                          <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{c.nota}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2 – DEUDAS */}
        {activeTab === 2 && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #334155" }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
                💡 <strong style={{ color: "#ef4444" }}>Flujo de deudas:</strong> Una deuda nace como DPRE (presunta) → si el empleador la reconoce o no aclara → pasa a DCPC (carátula) con detalle en DCRI → si queda impaga → puede ir a cobranza judicial (EMCT/CPET). Si se paga con rezago → aparece en CREZ.
              </p>
            </div>
            {data.deudas.grupos.map((g, i) => (
              <div key={i} style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #334155" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, color: "#f1f5f9" }}>{g.titulo}</h3>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b" }}>{g.desc}</p>
                <div style={{ fontSize: 12, background: "#0f172a", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#fbbf24", border: "1px solid #422006" }}>
                  ⚡ Regla clave: {g.regla}
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#0f172a" }}>
                        {["Campo", "Formato", "Notas"].map(h => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #334155" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.campos.map((c, j) => (
                        <tr key={j} style={{ borderBottom: "1px solid #1e293b" }}>
                          <td style={{ padding: "8px 12px", color: "#e2e8f0", fontWeight: 500 }}>{c.campo}</td>
                          <td style={{ padding: "8px 12px", color: "#38bdf8", fontFamily: "monospace" }}>{c.formato}</td>
                          <td style={{ padding: "8px 12px", color: "#94a3b8" }}>{c.nota}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3 – RELACIONES */}
        {activeTab === 3 && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #334155" }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
                💡 Cuando algo se reporta mal, <strong style={{ color: "#6366f1" }}>PERS es siempre el primer lugar a revisar</strong>. Casi todos los errores de consistencia entre archivos se detectan cruzando contra PERS.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.relaciones.principales.map((r, i) => (
                <div key={i} style={{
                  background: "#1e293b", borderRadius: 10, padding: 16,
                  border: `1px solid ${r.critico ? "#ef4444" : "#334155"}`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ background: "#3b82f622", color: "#60a5fa", borderRadius: 6, padding: "4px 10px", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{r.desde}</span>
                    <span style={{ color: "#475569", fontSize: 18 }}>→</span>
                    <span style={{ background: "#6366f122", color: "#a5b4fc", borderRadius: 6, padding: "4px 10px", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{r.hacia}</span>
                    {r.critico && <span style={{ background: "#ef444422", color: "#f87171", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>CRÍTICO</span>}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{r.regla}</div>
                </div>
              ))}
            </div>

            {/* Mapa visual simplificado */}
            <div style={{ marginTop: 24, background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, color: "#f1f5f9" }}>🗺️ Flujo de datos del ciclo de vida de un afiliado</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { fase: "1. Afiliación", archivos: ["PERS"], color: "#6366f1", desc: "Punto de entrada. Valida existencia y estado." },
                  { fase: "2. Cotizaciones activas", archivos: ["CTAS", "MCCI", "SCAI", "SCCV", "SPVC"], color: "#10b981", desc: "Saldos y movimientos por cuenta/fondo." },
                  { fase: "3. Deudas y rezagos", archivos: ["DPRE", "DCPC", "DCRI", "CREZ"], color: "#ef4444", desc: "Empleadores que no pagaron o cotizaciones atrasadas." },
                  { fase: "4. Pensión (vejez/invalidez)", archivos: ["AFPI", "AFPV", "PPVI", "RVVI", "ANVI"], color: "#ec4899", desc: "Dictámenes, modalidad, pagos y anualidades." },
                  { fase: "5. Fallecimiento", archivos: ["AFAL", "AFPS", "BEPS", "PBPS", "RVPS"], color: "#6b7280", desc: "Causante, beneficiarios, pagos sobrevivencia." },
                  { fase: "6. Bonos y extras", archivos: ["BONO", "DABR", "CDTF", "SETR"], color: "#f59e0b", desc: "Bonos de reconocimiento, cambios de fondo, solicitudes." },
                ].map((fase, i) => (
                  <div key={i} style={{ background: "#0f172a", borderRadius: 10, padding: 14, border: `1px solid ${fase.color}33` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: fase.color, marginBottom: 6 }}>{fase.fase}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                      {fase.archivos.map(a => (
                        <span key={a} style={{ background: fase.color + "22", color: fase.color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{a}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{fase.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4 – DIAGNÓSTICO */}
        {activeTab === 4 && (
          <div>
            <div style={{ background: "#1e293b", borderRadius: 10, padding: 16, marginBottom: 20, border: "1px solid #334155" }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
                💡 <strong style={{ color: "#fbbf24" }}>Proceso de validación SP:</strong> 1) Estructura inicial (EE) → 2) Coherencia y datos repetidos → 3) Validación de datos (intra e interarchivo). El rechazo en etapa 1 o 2 impide que la AFP transmita datos. Etapa 3 genera correcciones específicas.
              </p>
            </div>

            <h3 style={{ fontSize: 15, color: "#f1f5f9", marginBottom: 12 }}>❌ Errores más comunes y cómo prevenirlos</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {data.errores.tipicos.map((e, i) => (
                <div key={i} style={{ background: "#1e293b", borderRadius: 10, padding: 14, border: "1px solid #334155" }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div style={{ flex: "1 1 200px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>{e.error}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>Ejemplo: {e.ejemplo}</div>
                    </div>
                    <div style={{ flex: "1 1 200px" }}>
                      <div style={{ fontSize: 12, color: "#4ade80", marginBottom: 4 }}>✅ {e.prevencion}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ background: "#fbbf2422", color: "#fbbf24", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Código: {e.codigo}</span>
                        <span style={{ background: "#3b82f622", color: "#60a5fa", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{e.archivo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 15, color: "#f1f5f9", marginBottom: 12 }}>📟 Códigos de error EE (Estructura)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {data.errores.codigos.map((c, i) => (
                <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "10px 14px", border: "1px solid #334155" }}>
                  <span style={{ fontFamily: "monospace", color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>{c.cod}</span>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#f1f5f9" }}>🔎 Guía de diagnóstico rápido: ¿Qué tabla revisar según el problema?</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { prob: "Un RUN no existe o tiene DV inválido", tabla: "PERS", accion: "Validar módulo 11. Buscar el RUN en PERS primero." },
                  { prob: "Saldo no cuadra al cierre del mes", tabla: "CTAS ↔ MCCI", accion: "Sumar todos los movimientos MCCI del mes para ese RUN+cuenta+fondo y comparar con CTAS anterior + MCCI = CTAS actual." },
                  { prob: "Pensionado reportado pero sin dictamen", tabla: "AFPI o AFPV", accion: "Verificar campos de dictamen, fecha y modalidad en AFPI/AFPV. Cruzar estado en PERS (campo 21)." },
                  { prob: "Pago a pensionado sin respaldo", tabla: "PPVI ↔ AFPI/AFPV", accion: "El RUN en PPVI debe existir en AFPI o AFPV con modalidad compatible." },
                  { prob: "Beneficiario de sobrevivencia sin causante", tabla: "BEPS ↔ AFPS/AFAL", accion: "El RUN del causante en BEPS debe existir en AFAL y en AFPS si hay pensión de sobrevivencia." },
                  { prob: "Deuda sin detalle de involucrados", tabla: "DCPC ↔ DCRI", accion: "Toda deuda en DCPC debe tener registros en DCRI con el mismo N° de serie." },
                  { prob: "Prima de renta vitalicia no cuadra", tabla: "RVVI ↔ MCCI/DABR", accion: "Buscar en MCCI el cargo de traspaso de prima. Si el bono fue cedido, verificar en DABR." },
                  { prob: "Cotización declarada pero no abonada", tabla: "CREZ o DPRE", accion: "Si está en rezago: buscar en CREZ. Si no declaró ni pagó: buscar en DPRE." },
                ].map((d, i) => (
                  <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: 12, border: "1px solid #334155" }}>
                    <div style={{ fontSize: 13, color: "#f87171", fontWeight: 600, marginBottom: 4 }}>🔴 {d.prob}</div>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#64748b" }}>Tabla(s): </span>
                      <span style={{ color: "#60a5fa", fontFamily: "monospace", fontWeight: 700 }}>{d.tabla}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>→ {d.accion}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
