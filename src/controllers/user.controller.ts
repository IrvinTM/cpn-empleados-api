import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error Al Obtener Empleados",
        error: error instanceof Error ? error.message : "Error Desconocido"
      });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Empleado No Encontrado"
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error Al Obtener Empleado",
        error: error instanceof Error ? error.message : "Error Desconocido"
      });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      
      if (!userData.nombre || !userData.email || !userData.departamento) {
        res.status(400).json({
          success: false,
          message: "Nombre, Email Y Departamento Son Requeridos"
        });
        return;
      }

      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: "Empleado Creado Exitosamente",
        data: newUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error Al Crear Empleado",
        error: error instanceof Error ? error.message : "Error Desconocido"
      });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userData = req.body;

      const updatedUser = await this.userService.updateUser(id, userData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: "Empleado No Encontrado"
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Empleado Actualizado Exitosamente",
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error Al Actualizar Empleado",
        error: error instanceof Error ? error.message : "Error Desconocido"
      });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Empleado No Encontrado"
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Empleado Eliminado Exitosamente"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error Al Eliminar Empleado",
        error: error instanceof Error ? error.message : "Error Desconocido"
      });
    }
  }
}