import { Request, Response } from "express";
import CreateCourseService from "./CreateCourseService";


export function createCourse(req: Request, res: Response){

  CreateCourseService.execute({ 
    name: "Nodejs", 
    duration: 20, 
    educator: "David"
  });


  return res.send();
}