module.exports.listAttributes = (object) => {

  const pattern = [
    'address', 'birthdate', 'email', 'family_name', 'gender', 'given_name',
    'locale', 'middle_name', 'name', 'nickname', 'phone_number', 'picture',
    'preferred_username', 'profile', 'timezone', 'website', 'zoneinfo'
  ];

  const attributes = [];
  Object.keys(object).map((key) => {
    if (pattern.includes(key)) {
      attributes.push({
        Name: key,
        Value: object[key]
      });
    }
  });

  return attributes;
};
