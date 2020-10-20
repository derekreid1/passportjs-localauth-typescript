import { Router, Request, Response } from "express";
import Note from "../../models/Note";
import Resource from "models/Resource";


/**
 * The note controller is responsible for handling the HTTP requests.
 * Examples would be GET, POST, PUT, DELETE.
 */
class NoteController {
    // Path that is required in order to access the api http://localhost:8080/routes/api/notes
    public path = "/api/notes";
    public router = Router();
  
    constructor() {
      this.initializeRoutes();
    }
  
    /**
     * Creates the routes for the notes Controller
     * Ex. GET, PUT, POST, UPDATE, etc
     */
    public initializeRoutes(): void {
      this.router
        .route(this.path)
        .get(this.getAllNotes)
        .post(this.createNote);
      this.router
        .route(this.path + "/:id")
        .get(this.getNote)
        .put(this.updateNote)
        .delete(this.deleteNote);
      // Need to add patch
    }
  
    // Goes to route /api/notes
  
    /**
     * Grabs all notes in the database and sends them as a response in json
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    getAllNotes = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const note = await Note.findAll(); // Grabs all notes
        response.json(note);
      } catch (err) {
        response.status(400).json({ message: "Something went wrong" });
      }
    };
  
    /**
     * Creates a new note in the database if the request has the correct json
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    createNote = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        // If missing non-nullable fields it will create an error
        const note = await Note.create(request.body);
        response.status(201).json({ note });
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  
    // Goes to route /api/note/:id
  
    /**
     * Grabs a specific note based off the ID provided
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    getNote = async (request: Request, response: Response): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the request.params object and grab only id
        const note = await Note.findOne({
          where: { id: id },
        }); // Grabs the note where the id is 0
  
        if (note) {
          response.status(200).json(note);
        } else {
          response
            .status(404)
            .send("Note with the specified ID does not exist");
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  
    /**
     * Updates a note based off the ID provided
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    updateNote = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the object to only grab the id coming from the request
        const [updated] = await Note.update(request.body, {
          where: { id: id },
        }); // Destructure the array so we grab the updated version of our notes
  
        if (updated) {
          const updatedNote = await Note.findOne({ where: { id: id } }); // Grab the updated note
          response.status(200).json({ note: updatedNote }); // Return the updated note
        } else {
          response
            .status(404)
            .send("Note with the specified ID does not exist"); // note does not exist
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };

  //To get all notes and resources
    getNotesandResources = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the request.params object and grab only id
        const resource = await Resource.findOne({
          where: { id: id },
          include: Note,
        }); // Grabs the resource where the id is 0
  
        if (resource) {
          response.status(200).json(resource);
        } else {
          response.status(404).send("Resource with the specified ID does not exist");
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  
    /**
     * Deletes a note based off the ID provided
     * @param request HTTP browser request
     * @param response HTTP browser response
     */
    deleteNote = async (
      request: Request,
      response: Response
    ): Promise<void> => {
      try {
        const { id } = request.params; // Destructure the object to only grab the id coming from the request
        const deleted = await Note.destroy({
          where: { id: id },
        }); // Delete the note with the specified id
        if (deleted) {
          response.status(204).send("Note Deleted");
        } else {
          response
            .status(404)
            .send("Note with the specified ID does not exist");
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    };
  }
  
  export default NoteController;