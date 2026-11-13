# Laboratorio 4: Docker Compose

Este laboratorio continúa el servicio de cursos del Lab 3 y lo integra con MongoDB
 y reportes mediante Docker Compose. Reportes no tiene base de datos propia:
consulta `http://cursos:3000/cursos` por HTTP.

## Ejecutar

Abre Docker Desktop y una terminal en esta carpeta. Si el Lab 3 está activo,
detenlo primero desde su carpeta con `docker compose stop`, para liberar los
puertos 3000 y 4000 sin borrar sus datos.

```powershell
docker compose up --build -d
docker compose ps
docker compose logs -f cursos
```

MongoDB debe aparecer como `healthy`. Cursos publica el puerto 3000 y reportes
el 4000. Para salir de los logs usa Ctrl+C; los contenedores siguen activos.

## Crear cursos y consultar el resumen

1. Abre http://localhost:3000/cursos/demo dos o tres veces. Cada visita crea un
   curso `Desarrollo Web` de 4 créditos.
2. Abre http://localhost:3000/cursos para ver los cursos guardados.
3. Abre http://localhost:4000/resumen para ver `totalCursos` y `totalCreditos`.

## Experimento de resiliencia

```powershell
docker compose stop cursos
```

- http://localhost:4000/resumen devuelve HTTP 503 y
  `{"error":"El servicio de cursos no responde"}`.
- http://localhost:4000 sigue respondiendo
  `{"servicio":"reportes","estado":"ok"}`.

```powershell
docker compose start cursos
```

## Recarga automática

```powershell
docker compose watch
```

Mantén esa terminal abierta. En `cursos/index.js`, cambia el estado de la ruta
`/` de `'ok'` a `'funcionando'` y guarda. Compose sincroniza el archivo y reinicia
cursos. Al recargar http://localhost:3000 verás el cambio. Después restaura `'ok'`.
Los cambios en `cursos/package.json` reconstruyen la imagen.

## Persistencia y apagado

MongoDB guarda los datos en el volumen `datos-mongo` del proyecto Compose `lab4`.
La comprobación de salud se autentica con las credenciales configuradas para
MongoDB (`admin` / `secreto`).

```powershell
docker compose down
```