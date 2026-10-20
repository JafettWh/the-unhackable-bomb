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
3. **Variantes de partida:**
   - Cada partida selecciona aleatoriamente una de cinco configuraciones de respuestas para los seis módulos.

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

## Módulos

1. Completa la matriz visual con la operación indicada por `scan --spatial`.
2. Completa la serie numérica indicada por `decode --seq`.
3. Usa `query --trivia` para recibir dos pistas de elementos y sus números atómicos.
4. Usa `analyze --geometry` para conocer el objetivo angular de la variante.
5. Usa `calc --math` para calcular la frecuencia armónica y su fase.
6. Tras resolver los módulos 1–5, ejecuta `sudo override` y responde al código histórico indicado.

Los comandos de análisis no generan strikes; los comandos desconocidos y las respuestas incorrectas sí.

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

## GitHub Pages

El repositorio está configurado para publicar desde GitHub Actions. Sube los cambios a la rama `main` y en GitHub habilita **Settings → Pages → Build and deployment → GitHub Actions**. El workflow compila con `npm ci` y publica `dist`; la URL esperada es `https://jafettwh.github.io/the-unhackable-bomb/`.
