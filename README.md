# PlayRoom

Plataforma de gestión de juegos presenciales multijugador en tiempo real.

No es un juego digital — es un sistema operativo para juegos físicos que provee infraestructura compartida (sesión, roles, sincronización, score, torneos) sobre la cual se cargan juegos como módulos independientes.

**Stack:** HTML/JS vanilla · Firebase Realtime DB · Firebase Hosting  
**Sin frameworks. Sin instalación. Se abre en cualquier navegador.**

---

## Estado actual

| Componente | Estado |
|---|---|
| hub.html | ✅ Operativo — perfil, biblioteca, historial, PWA |
| playroom-ppt.html | ✅ Completo — torneos 1v1, eliminación y round robin |
| playroom-domino.html | ✅ Completo — mesas simultáneas, emparejamiento dinámico/fijo |
| engine-tournament.js | ⬜ Pendiente — Fase 2 |
| verdad-o-reto.html | ⬜ Pendiente — Fase 3 |

---

## Arquitectura

```
Hub (hub.html)
  ├── Perfil de usuario        localStorage
  ├── Biblioteca de juegos     cache en localStorage
  ├── Sesión y sala            Firebase Realtime DB
  └── iframe ──postMessage──▶ Juego (*.html)
                                └── UI pura, sin Firebase
```

El hub es el único punto de entrada. Los juegos son módulos descargables que se cachean localmente para funcionar sin internet.

### Contrato hub ↔ juego

```
Hub  ──▶  STATE_UPDATE   ──▶  Juego   (estado completo en cada cambio)
Hub  ◀──  GAME_ACTION    ◀──  Juego   (el juego propone, el hub valida)
Hub  ◀──  GAME_CLOSED    ◀──  Juego   (el juego notifica que terminó)
```

### Modos de conexión

| Modo | Descripción | Requiere |
|---|---|---|
| 1 · Un dispositivo | Estado en memoria, sin red | Nada |
| 2 · Multi-dispositivo | Firebase sincroniza en tiempo real | Internet |
| 3 · Red local | WebSocket en red local, sin internet | WiFi local (futuro) |

---

## Estructura de archivos

```
playroom/
  hub.html                  ← App principal, único punto de entrada
  playroom-ppt.html         ← Piedra Papel Tijera
  playroom-domino.html      ← Dominó
  manifest.json             ← PWA
  sw.js                     ← Service Worker
  games.json                ← Versiones de juegos
  engines/                  ← Motores de juego compartidos (Fase 2+)
  docs/
    playroom-hub-v1.docx    ← Documento de arquitectura
    playroom-plan.csv       ← Plan de trabajo
```

---

## Roadmap

| Fase | Contenido | Estado |
|---|---|---|
| Fase 0 | Hub operativo · PPT · Dominó · flujo hub↔juego | ✅ Completo |
| Fase 1 | Diseño contrato Engine · Engine Registry · patrones de juego | ⬜ Pendiente |
| Fase 2 | engine-tournament.js · migración PPT a UI pura | ⬜ Pendiente |
| Fase 3 | engine-turns.js · Verdad o Reto | ⬜ Pendiente |
| Fase 4 | Engines: roles · votación · carrera · economía | ⬜ Pendiente |
| Fase 5 | Migración Dominó a UI pura | ⬜ Pendiente |
| Fase 6 | Hub completo · PWA · modo red local | ⬜ Pendiente |

---

## Desarrollo

### Deploy

```bash
firebase deploy
```

### Flujo de trabajo

Cada tarea tiene un ID en `docs/playroom-plan.csv`.  
Usar el ID como mensaje de commit:

```bash
git add .
git commit -m "P0-01 fix spinner overlay al abrir juego desde hub"
git push
firebase deploy
```

### Contexto para nuevos chats con Claude

Subir al chat:
- Este README o `docs/playroom-hub-v1.docx` como contexto de arquitectura
- `docs/playroom-plan.csv` como contexto de tareas
- El archivo de código que se va a modificar

O compartir la URL raw del archivo en GitHub para que Claude lo lea directamente.

---

## Firebase

- **Proyecto:** juegos-encasa
- **Hosting:** juegos-encasa.web.app
- **Realtime DB:** juegos-encasa-default-rtdb

Plan Spark (gratuito). Sin Cloud Functions.

---

## Licencia

MIT — ver LICENSE
