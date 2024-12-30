import expressAsyncHandler from "express-async-handler";
import {
  FilmService
} from "./film.service.js";
import {
  handleUploadCloudinary
} from "../ulitilities/cloudinary.js";
class FilmController {
  createFilm = expressAsyncHandler(async (req, res, next) => {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUploadCloudinary(dataURI);

    req.body.thumbnailURL = cldRes.url;
    req.body.public_ID = cldRes.public_id;
    //console.log(cldRes);
    const response = await FilmService.createFilm(req.body);
    console.log(response);
    return res.status(200).json({
      msg: "Create film successfully!",
      success: true,
      data: response,
    });
  });

  updateFilm = expressAsyncHandler(async (req, res, next) => {
    const {
      id
    } = req.params;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUploadCloudinary(dataURI);
      req.body.thumbnailURL = cldRes.url;
      req.body.public_ID = cldRes.public_id;
    }

    const response = await FilmService.updateFilmById(id, req.body);

    return res.status(200).json({
      msg: "Update film successfully!",
      success: true,
      data: response,
    });
  });

  getAllFilms = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmService.getAllFilm();
    return res.status(200).json({
      msg: "Get all film successfully!",
      success: true,
      data: response,
    });
  });

  getFilmDetail = expressAsyncHandler(async (req, res, next) => {
    const {
      id
    } = req.params;
    const response = await FilmService.getFilmDetail(id);
    return res.status(200).json({
      msg: "Get film successfully!",
      success: true,
      data: response,
    });
  });

  searchFilm = expressAsyncHandler(async (req, res, next) => {
    const {
      keyword,
      page,
      limit
    } = req.body

    return res.status(200).json({
      msg: "Get film successfully!",
      success: true,
      data: await FilmService.searchFilms(keyword, page, limit),
    });
  });

}

export default new FilmController();