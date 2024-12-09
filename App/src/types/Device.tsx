export interface DeviceInterface {
    name: string;
    readings: {
        time: number;
        temperature?: number;
        humidity?: number;
        light?: boolean;
        moisture?: number;
    }[];
    light_toggle?: boolean;
    valve_toggle?: boolean;
}