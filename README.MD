# Will It Rain On My Parade?

Este proyecto es una aplicación web de análisis meteorológico diseñada para el **NASA Space Apps Challenge 2025**. Permite a los usuarios planificar actividades al aire libre al proporcionar una puntuación de idoneidad climática personalizada, análisis de probabilidades de eventos extremos y tendencias climáticas a largo plazo, todo ello basado en datos históricos de la API POWER de la NASA.

## 🚀 Características Principales

* **Puntuación de Idoneidad Personalizada (1-5):** Introduce una actividad, ubicación y fecha, y obtén una puntuación clara sobre qué tan adecuado es el clima. El sistema ajusta la importancia de la temperatura, el viento y la lluvia según la actividad que elijas.
* **Análisis de Probabilidades:** Descubre la probabilidad (%) de enfrentar condiciones extremas como calor, frío, lluvia, viento o humedad incómoda, presentadas en un gráfico fácil de entender.
* **Análisis de Tendencias Climáticas:** Visualiza cómo han evolucionado la temperatura y los eventos climáticos extremos en una ubicación durante la última década, para entender el cambio climático a nivel local.
* **Comparador de Ubicaciones:** ¿No estás seguro de dónde ir? Compara las condiciones climáticas de hasta tres lugares diferentes y obtén una recomendación sobre cuál es el mejor para tu actividad.
* **Selección de Ubicación Flexible:** Introduce una ubicación escribiendo su nombre o seleccionándola directamente en un mapa interactivo.
* **Exportación de Datos:** Descarga los resultados de tu consulta en formatos **CSV** o **JSON** con un solo clic.

## 🛠️ Tecnologías Utilizadas

### Backend
* **Lenguaje:** Python
* **Framework:** FastAPI
* **Servidor:** Uvicorn
* **Análisis de Datos:** NumPy, SciPy
* **Geocodificación:** Geopy
* **Fuente de Datos:** API POWER de la NASA

### Frontend
* **Framework:** Next.js
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Mapas:** React-Leaflet
* **Gráficos:** Recharts

## 🏁 Cómo Empezar

### Backend
1.  Navega a la carpeta `Backend`.
2.  Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```
3.  Inicia el servidor:
    ```bash
    uvicorn app.main:app --reload
    ```
    El servidor estará disponible en `http://localhost:8000`.

### Frontend
1.  Navega a la carpeta `frontend`.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env.local` en la raíz de `frontend` y añade la URL de la API:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```
4.  Inicia la aplicación de desarrollo:
    ```bash
    npm run dev
    ```
    Abre `http://localhost:3000` en tu navegador.