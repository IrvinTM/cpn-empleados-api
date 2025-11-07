import { Router } from "express";
import { ExportController } from "../controllers/export.controller";

const router: Router = Router();
const exportController = new ExportController();

// POST /api/exportar/empleados - Exportar empleados a Cloud Storage
router.post("/empleados", (req, res) => {
  exportController.exportEmpleados(req, res);
});

export default router;