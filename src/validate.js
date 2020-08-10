import * as yup from 'yup';

const schema = yup.string()
  .url()
  .required();

const validate = (url, feeds) => {
  try {
    schema.notOneOf(feeds).validateSync(url, { abortEarly: false });
    return [];
  } catch (err) {
    return err.inner;
  }
};

export default validate;
