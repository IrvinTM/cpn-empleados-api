export interface IUser {
  id: number;
  nombre: string;
  email: string;
  departamento: string | null; 
  fecha_contratacion: Date | null; 
}

export interface ICreateUser {
  nombre: string;
  email: string;
  departamento: string | null;  
  fecha_contratacion?: Date | null; 
}