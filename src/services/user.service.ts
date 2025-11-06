import { PrismaClient } from "../generated/prisma/client";
import { IUser, ICreateUser } from "../models/user.interface";

const prisma = new PrismaClient();

export class UserService {
  
  public async getAllUsers(): Promise<IUser[]> {
    try {
      const empleados = await prisma.empleado.findMany();
      return empleados as IUser[];
    } catch (error) {
      console.error("Error Obteniendo Empleados:", error);
      throw new Error("Error Al Obtener Empleados De La Base De Datos");
    }
  }

  public async getUserById(id: number): Promise<IUser | null> {
    try {
      const empleado = await prisma.empleado.findUnique({
        where: { id }
      });
      return empleado as IUser | null;
    } catch (error) {
      console.error(`Error Obteniendo Empleado ${id}:`, error);
      throw new Error("Error Al Obtener Empleado De La Base De Datos");
    }
  }

  public async createUser(userData: ICreateUser): Promise<IUser> {
    try {
      const nuevoEmpleado = await prisma.empleado.create({
        data: {
          nombre: userData.nombre,
          email: userData.email,
          departamento: userData.departamento,
          fecha_contratacion: userData.fecha_contratacion || new Date()
        }
      });
      return nuevoEmpleado as IUser;
    } catch (error) {
      console.error("Error Creando Empleado:", error);
      throw new Error("Error Al Crear Empleado En La Base De Datos");
    }
  }

  public async updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      const empleadoActualizado = await prisma.empleado.update({
        where: { id },
        data: userData
      });
      return empleadoActualizado as IUser;
    } catch (error) {
      console.error(`Error Actualizando Empleado ${id}:`, error);
      return null;
    }
  }

  public async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.empleado.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error(`Error Eliminando Empleado ${id}:`, error);
      return false;
    }
  }
}