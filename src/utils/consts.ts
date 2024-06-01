import { celebrate, Segments, Joi } from "celebrate"
import { url, id } from "./patterns"

export const getUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: id
  })
});

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(url)
  })
});

export const signinValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
});

export const updateUserInfoValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200)
  })
});

export const updateUserAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().regex(url)
  })
});

export const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    owner: id,
    link: Joi.string().regex(url).required()
  })
});

export const updateCardValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: id
  })
});