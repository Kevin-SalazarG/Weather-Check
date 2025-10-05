# Will It Rain On My Parade?

This project is a web-based weather analysis application designed for the **2025 NASA Space Apps Challenge**. It allows users to plan outdoor activities by providing a personalized weather suitability score, analysis of extreme event probabilities, and long-term climate trends, all based on historical data from the NASA POWER API.

## 🚀 Key Features

* **Custom Suitability Score (1-5):** Enter an activity, location, and date to get a clear score on how suitable the weather is. The system adjusts the importance of temperature, wind, and rain depending on your chosen activity.
* **Probability Analysis:** Find out the likelihood (%) of facing extreme conditions like heat, cold, rain, wind, or uncomfortable humidity, presented in an easy-to-understand chart.
* **Climate Trends Analysis:** Visualize how temperature and extreme weather events have evolved in a location over the last decade to understand local climate change.
* **Location Comparator:** Not sure where to go? Compare weather conditions for up to three different locations and get a recommendation on which is best for your activity.
* **Flexible Location Input:** Enter a location by typing its name or by selecting it directly on an interactive map.
* **Data Export:** Download your query results in **CSV** or **JSON** formats with a single click.

## 🛠️ Tech Stack

### Backend
* **Language:** Python
* **Framework:** FastAPI
* **Server:** Uvicorn
* **Data Analysis:** NumPy, SciPy
* **Geocoding:** Geopy
* **Data Source:** NASA POWER API

### Frontend
* **Framework:** Next.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Maps:** React-Leaflet
* **Charts:** Recharts

## 🏁 Getting Started

### Backend
1.  Navigate to the `Backend` folder.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the server:
    ```bash
    uvicorn app.main:app --reload
    ```
    The server will be available at `http://localhost:8000`.

### Frontend
1.  Navigate to the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` root and add the API URL:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` in your browser.