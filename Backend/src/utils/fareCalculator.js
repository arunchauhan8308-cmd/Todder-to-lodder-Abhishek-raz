
const FARE_CONFIG = {
    base_fare: 50,      // Fix base fare (e.g., ₹50)
    rate_per_km: 15,    // Standard rate per kilometer (e.g., ₹15/km)
    
    // Aapke bataye gaye multipliers
    vehicle_multiplier: {
        e_cart: 1.0,
        pickup: 1.3,
        tempo: 1.6,
        mini_truck: 2.0
    },
    
    // Category ke hisaab se optional loading charges
    loading_charges: {
        furniture: 150,
        construction: 200,
        electronics: 100,
        parcels: 0,
        default: 50
    }
};

exports.calculateFare = (distance_km, vehicle_type, goods_category) => {
    // 1. Vehicle multiplier nikalna (agar galat type aaye toh default 1.0 le lega)
    const multiplier = FARE_CONFIG.vehicle_multiplier[vehicle_type] || 1.0;

    // 2. Loading charge nikalna
    const category = goods_category ? goods_category.toLowerCase() : 'default';
    const loading_charge = FARE_CONFIG.loading_charges[category] || FARE_CONFIG.loading_charges.default;

    // 3. Aapka Formula 
    const final_fare = FARE_CONFIG.base_fare + (distance_km * FARE_CONFIG.rate_per_km * multiplier) + loading_charge;

    // Decimal values (jaise 145.67) ko round off karke wapas bhejna
    return Math.round(final_fare);
};