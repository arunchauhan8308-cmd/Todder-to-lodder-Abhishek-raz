
exports.calculateDistance = async (pickupCoordinates, dropCoordinates) => {
    try {
        // API key ko .env file se lenge
        const apiKey = process.env.GOOGLE_MAPS_API_KEY; 

        if (!apiKey) {
            throw new Error("Google Maps API key is missing in .env");
        }

        // MongoDB (GeoJSON) [Lng, Lat] ko Google Maps [Lat, Lng] mein convert karna
        const origin = `${pickupCoordinates[1]},${pickupCoordinates[0]}`;
        const destination = `${dropCoordinates[1]},${dropCoordinates[0]}`;

        // Google Maps Distance Matrix API ka URL
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

        // API Call (Node.js ka native fetch use kar rahe hain)
        const response = await fetch(url);
        const data = await response.json();

        // Check karein ki API ne sahi result diya hai ya nahi
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
            
            // Google distance ko meters mein deta hai
            const distanceMeters = data.rows[0].elements[0].distance.value;
            
            // Meters ko Kilometers (KM) mein convert karein
            const distanceKm = distanceMeters / 1000;
            
            return distanceKm;
        } else {
            throw new Error("Could not calculate distance. Please check coordinates.");
        }
    } catch (error) {
        throw new Error("Distance calculation failed: " + error.message);
    }
};