import { Joi } from 'celebrate';

// eslint-disable-next-line
export const url = /https?:\/\/(?:www\.|(?!www))[\w\d-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=]{1,}\.[\w]{2,}#?/;
export const id = Joi.string().alphanum().length(24).required();
