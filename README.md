# RPG-Cloud — Rogue-like RPG (Cloud Native)

Un videogioco RPG rogue-like con architettura **cloud-native a 3 livelli**, containerizzato con Docker Compose e conforme ai **12-Factor App**.

Evoluzione del progetto [ProgettoRPG](https://github.com/AliceMassetani/ProgettoRPG) (esame di Metodologie di Programmazione, Università di Camerino).

## Architettura

| Livello | Tecnologia | Porta |
|---|---|---|
| **Frontend** | Angular 19 + Nginx | `4200` |
| **Backend** | Spring Boot 3.3 (Java 21) — REST API | `8080` |
| **Database** | MariaDB 11.8 | `3306` |

I tre container comunicano tramite una rete Docker interna (`rpg-network`). Il frontend Angular viene servito da Nginx, che funge anche da **reverse proxy** per le chiamate API verso il backend.

```
Browser → Nginx (:4200) → Spring Boot (:8080) → MariaDB (:3306)
```

## Avvio Rapido

```bash
docker compose up -d
```

Apri il browser su **http://localhost:4200**.

## Sviluppo Locale

### Backend

```bash
cd backend
./gradlew bootRun
```

### Frontend

```bash
cd frontend
npm install
npx ng serve
```

## API REST

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/api/game/new` | Crea una nuova partita |
| `GET` | `/api/game/{id}` | Stato corrente della partita |
| `POST` | `/api/game/{id}/move` | Muove l'eroe (`UP/DOWN/LEFT/RIGHT`) |
| `POST` | `/api/game/{id}/use-item` | Usa un item dall'inventario |
| `POST` | `/api/game/{id}/save` | Salva nel database |
| `POST` | `/api/game/{id}/load` | Carica un salvataggio |
| `GET` | `/api/game/saves` | Lista salvataggi |
| `DELETE` | `/api/game/{id}` | Elimina un salvataggio |

---

*Progetto per il corso di Applicazioni Web e Mobile su Cloud — Università di Camerino, A.A. 2025/2026*
