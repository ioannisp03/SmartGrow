export interface ReadingInterface {
    time: number;
    temperature: number;
    humidity: number;
    light: boolean;
    moisture: number;
}

export interface DeviceInterface {
    _id: string;
    name: string;
    live?: {
        light_toggle?: boolean;
        valve_toggle?: boolean;
    } & ReadingInterface;
    history: ReadingInterface[];
    light_toggle?: boolean;
    valve_toggle?: boolean;
}