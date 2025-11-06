import prisma from "../config/db.config";
import { Empleado } from "../generated/prisma/client";

export const empleadoRepository = {
  // We don't need the model file interface anymore, 
  // Prisma generates 'Empleado' type for us.
  
  // Create
  async create(data: Omit<Empleado, 'id' | 'createdAt' | 'updatedAt'>): Promise<Empleado> {
    return prisma.empleado.create({
      data: data,
    });
  },

  // Read (All)
  async findAll(): Promise<Empleado[]> {
    return prisma.empleado.findMany();
  },

  // Read (One)
  async findById(id: string): Promise<Empleado | null> {
    return prisma.empleado.findUnique({
      where: { id: id },
    });
  },

  // Update
  async update(id: string, data: Partial<Empleado>): Promise<Empleado | null> {
    return prisma.empleado.update({
      where: { id: id },
      data: data,
    });
  },

  // Delete
  async delete(id: string): Promise<Empleado | null> {
    return prisma.empleado.delete({
      where: { id: id },
    });
  },
};