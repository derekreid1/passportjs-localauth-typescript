import { Router, Request, Response } from "express";
import Tag from "../../models/Tag";


/**
 * The resource controller is responsible for handling the HTTP requests.
 * Examples would be GET, POST, PUT, DELETE.
 */
class TagController {
    // Path that is required in order to access the api http://localhost:8080/routes/api/tags
    public path = "/api/tags";
    public router = Router();
  
    constructor() {
      this.initializeRoutes();
    }
  
    /**
     * Creates the routes for the resource Controller
     * Ex. GET, PUT, POST, UPDATE, etc
     */
    public initializeRoutes(): void {
      this.router
        .route(this.path)
        .get(this.getAllTags)
        .post(this.createTag);
      this.router
        .route(this.path + "/:id")
        .get(this.getTag)
        .put(this.updateTag)
        .delete(this.deleteTag);
      // Need to add patch
    }
  
    // Goes to route /api/resources
  
    /**
     * Grabs all resources in the database and sends them as a response in json
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    getAllTags = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const resource = await Tag.findAll(); // Grabs all resources
        response.json(resource);
      } catch (err) {
        response.status(400).json({ message: "Something went wrong" });
      }
    };
  
    /**
     * Creates a new tag in the database if the request has the correct json
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    createTag = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        // If missing non-nullable fields it will create an error
        const tag = await Tag.create(request.body);
        response.status(201).json({ tag });
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  
    // Goes to route /api/tag/:id
  
    /**
     * Grabs a specific tag based off the ID provided
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    getTag = async (request: Request, response: Response): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the request.params object and grab only id
        const tag = await Tag.findOne({
          where: { id: id },
        }); // Grabs the tag where the id is 0
  
        if (tag) {
          response.status(200).json(tag);
        } else {
          response
            .status(404)
            .send("Tag with the specified ID does not exist");
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  
    /**
     * Updates a tag based off the ID provided
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    updateTag = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the object to only grab the id coming from the request
        const [updated] = await Tag.update(request.body, {
          where: { id: id },
        }); // Destructure the array so we grab the updated version of our tags
  
        if (updated) {
          const updatedTag = await Tag.findOne({ where: { id: id } }); // Grab the updated tag
          response.status(200).json({ resource: updatedTag }); // Return the updated tag
        } else {
          response
            .status(404)
            .send("Tag with the specified ID does not exist"); // tag does not exist
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  
    /**
     * Deletes a resource based off the ID provided
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    deleteTag = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the object to only grab the id coming from the request
        const deleted = await Tag.destroy({
          where: { id: id },
        }); // Delete the resource with the specified id
        if (deleted) {
          response.status(204).send("Tag Deleted");
        } else {
          response
            .status(404)
            .send("Tag with the specified ID does not exist");
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  }
  
  export default TagController;