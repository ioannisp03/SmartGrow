export interface DeviceInterface {
    name: string;
    temperature: { time: number; value: number }[];
    water_level: { time: number; value: number }[];
    humidity: { time: number; value: number }[];
    light_toggle?: boolean;
    valve_toggle?: boolean;
}