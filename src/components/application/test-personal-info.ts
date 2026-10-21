import { emptyPersonalInfo, validatePersonalInfo } from "./personal-info";

const validInfo = {
  ...emptyPersonalInfo,
  firstName: "Luisa",
  lastName: "Smith",
  age: "20",
  email: "luisa@example.com",
  cellPhone: "(617) 555-1234",
  street: "123 Main St",
  city: "Boston",
  state: "MA",
  zip: "02111",
  emergencyContactFirstName: "Jane",
  emergencyContactLastName: "Smith",
  emergencyContactPhone: "6175559876",
};

console.log("VALID INFO:", validatePersonalInfo(validInfo));

console.log(
  "INVALID EMAIL:",
  validatePersonalInfo({ ...validInfo, email: "not-an-email" }),
);

console.log(
  "INVALID PHONE:",
  validatePersonalInfo({ ...validInfo, cellPhone: "12345" }),
);

console.log(
  "INVALID AGE:",
  validatePersonalInfo({ ...validInfo, age: "20.5" }),
);

console.log(
  "EMPTY REQUIRED FIELD:",
  validatePersonalInfo({ ...validInfo, firstName: " " }),
);
