# TECNOLÓGICO NACIONAL DE MÉXICO
## Ingeniería en Sistemas Computacionales — Ingeniería de Software

**Integrantes del Equipo:**
* Sebastian Perez Carnero
* Axel Yael Pompa Gutierrez
* Miguel Angel Orta Lira

---

# ACTIVIDAD 8.1: Diseño y Prototipado de Pantallas Principales (Sistema AGROPESO)

## 1. Pantallas Principales Diseñadas (Casos de Uso Semana 3)
Alineado al modelo relacional normalizado (`agropeso_db`), se diseñaron las tres pantallas críticas del sistema:
1. **Registro de Pesaje (`pesaje`):** Captura de peso bruto, cálculo automático de tara por arpillas, peso neto y liquidación monetaria según la tarifa vigente (`configuracion_precio`).
2. **Gestión de Jornaleros (`jornalero`):** Consulta, alta, edición de cuadrillas y control de estatus (`Activo` / `Bloqueado`).
3. **Control de Préstamos y Vales (`prestamo_vale`):** Registro de adelantos económicos solicitados por los trabajadores agrícolas.

---

## 2. Documentación de Heurísticas de Jakob Nielsen Aplicadas

### Heurística 1: Visibilidad del estado del sistema (*Visibility of system status*)
* **Implementación:** En la pantalla de *Registro de Pesaje*, cada cambio en el peso bruto o número de arpillas recalcula de manera inmediata la tara, el peso neto real y el monto total a pagar. Asimismo, un indicador visual permanente informa al operador el estado de sincronización offline (`estado_sincronizacion`) con el servidor.

### Heurística 2: Prevención de errores (*Error prevention*)
* **Implementación:** El formulario valida en tiempo real que el peso neto sea estrictamente mayor a `0.00 kg` y verifica el estatus del trabajador en la tabla `jornalero`. Si un trabajador aparece como `Bloqueado`, el sistema deshabilita el botón de registro y muestra una advertencia explícita para evitar transacciones no autorizadas.

### Heurística 3: Consistencia y estándares (*Consistency and standards*)
* **Implementación:** Se mantiene una jerarquía visual uniforme en todas las vistas: cabecera institucional, rutas de navegación, agrupación por tarjetas y botones de acción estandarizados (verde para confirmar acciones principales, gris para cancelar o limpiar).

### Heurística 4: Coincidencia entre el sistema y el mundo real (*Match between system and the real world*)
* **Implementación:** Se emplea el vocabulario habitual de las operaciones agrícolas locales (<em>arpillas, tara, cuadrilla, jornalero, chile verde/seco</em>), eliminando tecnicismos innecesarios para reducir la curva de aprendizaje del operador en campo.

---

## 3. Contenido del Paquete ZIP de Entrega
* `prototipo_interactivo_agropeso.html`: Prototipo funcional interactivo que integra los **3 wireframes**, el **mockup de alta fidelidad** y la **documentación de heurísticas**.
* `Documentacion_Actividad_8_1_AGROPESO.md`: Documento técnico listo para integrar en el reporte del proyecto final.
