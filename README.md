# SmartGrow

SmartGrow is a software solution designed to help plant enthusiasts track and monitor the environment of their plants. By integrating various sensors, SmartGrow provides real-time metrics such as temperature, humidity, moisture, and light levels. This platform is built using **Flask** for the backend, **React** for the frontend, and **MQTT** for real-time communication.

## Features

- **Real-Time Monitoring**: Track various environmental metrics of your plant, including:
  - Temperature
  - Humidity
  - Moisture levels
  - Light intensity
  
- **MQTT Integration**: Efficient communication with IoT sensors using MQTT protocol for real-time updates and monitoring.
  
- **User Dashboard**: View and manage all your plants through a user-friendly web interface built with React.

- **Plant Profiles**: Store and manage data for multiple plants and track their growth and environment over time.

- **Secure Authentication**: Users can securely sign in to track their plant data.

## Technologies Used

- **Frontend**: 
  - React (for the user interface)
  
- **Backend**:
  - Flask (for the server and API)
  - MQTT (for real-time communication)
  - Bcrypt (for hashing, security, and encryption)
  
- **Database**: 
  - MongoDB (for storing user and plant data)

## Installation

To set up the SmartGrow project locally, follow these steps:

### Backend (Flask)

1. Clone the repository:
    ```bash
    git clone https://github.com/isaacwallace123/SmartGrow.git
    cd SmartGrow/Server
    ```

2. Create a virtual environment and install dependencies:
    ```bash
    python -m venv .venv
    .venv\Scripts\activate  # On Windows
    # or
    source .venv/bin/activate  # On macOS/Linux
    pip install -r requirements.txt
    ```

3. Set up environment variables (e.g., `MQTT_BROKER`, `DB_URI`, etc.). You need to create a `.env` file for Flask configurations.

4. Run the backend server:
    ```bash
    flask run
    ```

    By default, the server should be accessible at `http://localhost:5000`.

### Frontend (React)

1. Change directory to the frontend folder:
    ```bash
    cd SmartGrow/App
    ```

2. Install the required dependencies:
    ```bash
    yarn
    ```

3. Build the frontend pages:
    ```bash
    yarn build
    ```

    By default, the React frontend should be rendered at your server `http://localhost:5000`.

### MQTT Broker (Optional)

If you're running your own MQTT broker, you can use Mosquitto or any other MQTT broker of your choice.

To install Mosquitto on your system, follow the installation instructions [here](https://mosquitto.org/download/).

---

## Usage

1. **Sign Up / Log In**: Users can sign up and log into their account to manage their plants.

2. **Add Plants**: Users can add plants, where they can specify the plant type, monitor metrics, and keep track of data over time.

3. **View Data**: Real-time data on the plant's environment (temperature, humidity, moisture, light) can be viewed in the dashboard.

4. **Receive Alerts**: Based on thresholds (e.g., low moisture, high temperature), users can receive alerts and take appropriate actions.

---

## Contributing

We welcome contributions! If you'd like to contribute to SmartGrow, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or inquiries, feel free to reach out:

- Email: [goosewal@gmail.com](mailto:goosewal@gmail.com)
- GitHub: [https://github.com/isaacwallace123/smartgrow](https://github.com/isaacwallace123/smartgrow)

---

## Acknowledgements

- **Flask** for the backend framework
- **React** for the frontend framework
- **MQTT** for real-time communication
- **Bcrypt** for hashing, encryption, and security
- **MongoDB** for database storage
