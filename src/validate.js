import * as yup from 'yup';

const validate = (url, feeds) => {
  console.log(feeds);
  const schema = yup.string()
    .url()
    .required()
    .notOneOf(feeds);
  try {
    schema.validateSync(url, { abortEarly: false });
    return [];
  } catch (err) {
    return err.inner;
  }
};

export default validate;
