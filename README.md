# THE UNHACKABLE BOMB (SERIE: BOMB-882)

Proyecto de simulación interactiva para la asignatura **Arquitectura de Software / Ingeniería de Software II** basado en la actividad lúdica *"The Unhackable Bomb"*.

---

## 🎯 Objetivos del Proyecto

1. **Fase de Caja Negra (Evaluación / Jugabilidad):**
   - Para un jugador no advertido, el panel parece un rompecabezas caótico e impenetrable.
   - Tiempo límite: **15:00 minutos**.
   - Penalizaciones progresivas:
     - **1er Strike:** -2 minutos instantáneos (-120s) y velocidad de reloj acelerada a **1.5x**.
     - **2do Strike:** -4 minutos instantáneos (-240s), transición automática a **¡ESTADO DE PÁNICO!** y velocidad a **3.0x**.
     - **3er Strike:** **Detonación instantánea** catastrófica.
2. **Fase de Caja Blanca (Arquitectura & SOLID):**
   - Orientación a objetos (POO) estricta en TypeScript con interfaces, clases abstractas y modificadores de acceso (`public`, `private`, `protected`).
   - Sin código rígido (*hardcoded*).
   - Integración formal de los patrones de diseño de la rúbrica.
3. **Resolución en Vivo por el Creador:**
   - La semilla determinista `BOMB-882` permite al creador resolver los 6 módulos en **menos de 60 segundos** frente a la clase.

---

## 🏗️ Patrones de Diseño Implementados

| Patrón | Tipo | Clases / Interfaces Clave | Rol en el Sistema |
|---|---|---|---|
| **State** | Comportamiento | `IBombState`, `NormalState`, `UnlockedState`, `PanicState`, `DefusedState`, `ExplodedState` | Gestiona el ciclo de vida de la bomba, multiplicadores de velocidad (1x, 1.5x, 3x) y estados finales. |
| **Strategy** | Comportamiento | `IDefusalStrategy`, `StandardStrategy`, `DeductiveStrategy` | Intercambia dinámicamente el algoritmo de validación (de modo distractor a fórmulas deductivas). |
| **Observer** | Comportamiento | `IBombSubject`, `IBombObserver`, `BombContext`, `BaseModule` | Sincroniza reactivamente los módulos a cada tick, strike y cambio de velocidad/estado. |
| **Factory Method** | Creacional | `ModuleFactory` | Instancia los 6 módulos con la semilla determinista `BOMB-882`. |
| **Decorator** | Estructural | `ModuleDecorator`, `SymbolDecorator` | Añade distorsión visual, glitch CSS y parpadeo CRT al Módulo 4 sin alterar su lógica base. |

---

## ⚡ Guía de Resolución Rápida (< 60 Segundos) - Semilla BOMB-882

1. **Módulo 1 (Botón de Fases):** Observa el segundero del reloj principal. Cuando sea un número **PAR** (ej. 14:58, 14:56), pulsa el **Botón Azul**. El estado cambiará a `DESBLOQUEADO (DEDUCTIVO)`.
2. **Módulo 2 (Pantalla Numérica):** Con 0 strikes y display en 4, pulsa la tecla **4** (Fórmula: `Display - Strikes` = 4 - 0 = 4).
3. **Módulo 3 (Cables de Colores):** Como el Módulo 1 es azul, corta únicamente el **CABLE AZUL**.
4. **Módulo 4 (Teclado de Símbolos):** Ignora el efecto glitch del decorador y pulsa en secuencia: **Lambda (λ)** y luego **Delta (Δ)**.
5. **Módulo 5 (Dial de Frecuencia Hz):** Observa los minutos restantes en el reloj (ej. 14 min). Ajusta el dial a `Minutos × 10` = **140 Hz** y pulsa **Sintonizar / Confirmar**.
6. **Módulo 6 (Interruptor Maestro):** Con los módulos 1 al 5 en verde, haz clic para **levantar la cubierta de seguridad** y acciona la palanca **KILL**.

¡Bomba desactivada con éxito y fanfarria de victoria!

---

## 🚀 Ejecución y Comandos

### Instalar dependencias
```bash
npm install
```

### Ejecutar servidor de desarrollo local
```bash
npm run dev
```
Acceder a: `http://localhost:5173/`

### Ejecutar pruebas automatizadas de lógica determinista
```bash
npm test
```

### Compilar para producción
```bash
npm run build
```
