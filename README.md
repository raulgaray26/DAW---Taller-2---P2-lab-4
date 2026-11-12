# Laboratorio 4: Docker Compose

Aplicación sencilla con tres servicios: MongoDB guarda los cursos, cursos los
consulta y reportes pide los datos a cursos por HTTP para calcular un resumen.
Reportes no tiene una base de datos propia. Las respuestas se ven como JSON en
el navegador; este laboratorio no necesita una interfaz gráfica.

## 1. Preparar

Abre Docker Desktop y espera a que el motor esté listo. En PowerShell, desde
la carpeta `labs`, entra a la carpeta nueva:

```powershell
cd .\lab4
```

Los puertos 3000 y 4000 deben estar libres. Si el laboratorio anterior sigue
ejecutándose con Compose, puedes detenerlo desde `lab4` con:

```powershell
docker compose -f ..\lab-microservicios\compose.yaml stop
```

Si en el laboratorio anterior creaste contenedores individuales, detenlos con
`docker stop cursos mongodb` si esos son sus nombres.

## 2. Levantar los servicios

Ejecuta desde `lab4`:

```powershell
docker compose up --build -d
docker compose ps
```

No necesitas instalar Node.js ni MongoDB en Windows, ni ejecutar `npm install`:
Docker construye los servicios con sus dependencias. La primera vez puede tardar
por la descarga de imágenes.

Debes ver MongoDB como `healthy`, cursos en el puerto 3000 y reportes en el 4000.
Compose crea la red y permite que reportes encuentre a cursos por su nombre:
`http://cursos:3000`. Cursos espera a que MongoDB esté disponible antes de iniciar.

Para ver los mensajes de cursos:

```powershell
docker compose logs -f cursos
```

Sal de los logs con Ctrl+C; los servicios siguen ejecutándose.

## 3. Probar en el navegador

1. Abre <http://localhost:3000> para ver `{"servicio":"cursos","estado":"ok"}`.
2. Visita <http://localhost:3000/cursos/demo> tres veces, recargando la página.
   Cada visita guarda un nuevo curso de 4 créditos en MongoDB.
3. Abre <http://localhost:3000/cursos> para ver los cursos guardados.
4. Abre <http://localhost:4000/resumen> para ver el resumen.

Si empezaste con la base vacía y creaste tres cursos, el resultado será:

```json
{"totalCursos":3,"totalCreditos":12}
```

Antes de crear cursos el resumen contiene ceros. Si creas más cursos, los totales
aumentan. MongoDB conserva los datos en el volumen `datos-mongo`.

## 4. Experimento de resiliencia

Detén únicamente cursos:

```powershell
docker compose stop cursos
```

Abre <http://localhost:4000/resumen>. Devuelve HTTP 503 con:

```json
{"error":"El servicio de cursos no responde"}
```

Abre <http://localhost:4000>. Reportes sigue funcionando y responde:

```json
{"servicio":"reportes","estado":"ok"}
```

Para comprobar también el código HTTP desde PowerShell:

```powershell
curl.exe -i http://localhost:4000/resumen
```

Vuelve a iniciar cursos:

```powershell
docker compose start cursos
```

Espera unos segundos y recarga el resumen. Funciona de nuevo sin reiniciar reportes.

## 5. Probar Compose Watch

Con los servicios levantados, ejecuta desde `lab4`:

```powershell
docker compose watch
```

Abre `cursos/index.js` y cambia `estado: 'ok'` por `estado: 'funcionando'` en
la ruta `/`. Guarda el archivo y recarga <http://localhost:3000> después de unos
segundos. Verás el nuevo estado porque Compose copia el código y reinicia cursos.
Si cambias `cursos/package.json`, Compose reconstruye su imagen.

Ctrl+C termina la observación. Puedes volver a dejar el estado en `ok`.

## 6. Terminar

```powershell
docker compose down
```

Elimina los contenedores y la red, pero conserva los cursos en el volumen.
Al ejecutar otra vez `docker compose up --build -d`, los datos siguen ahí.

Solo si quieres borrar también todos los cursos y empezar desde cero:

```powershell
docker compose down -v
```
