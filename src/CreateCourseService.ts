
interface Course {
  name: string;
  duration: number;
  educator: string;
}

class CreateCourseService {
  execute({name, duration, educator}: Course) {
    console.log(name, duration, educator);
  }
}

// exports an instance
export default new CreateCourseService();