import { Box, Button, Card, FormLabel, Heading, Input, Select, Stack, Text, FormControl, FormErrorMessage, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link,useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { RegisterApi } from "../../apis";
import logo from "../../assets/logo.png";

const schema = yup.object().shape({
  userType: yup.string().required("User type is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  department: yup.string().when("userType", {
    is: "doctor",
    then: (schema) => schema.required("Department is required for doctors"),
  }),
  speciality: yup.string().when("userType", {
    is: "doctor",
    then: (schema) => schema.required("Speciality is required for doctors"),
  }),
});

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userType = watch("userType");
  const toast = useToast();
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: (data) => RegisterApi(data),
    mutationKey: ["signup"],
    onSuccess: (response, data) => {
      toast({
        title: "Signup Successful!",
        description: "Your account has been created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      reset();
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const onSubmit = async (data) => {
    try {
      signupMutation.mutate(data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" bg="gray.100">
      <Card p={8} borderRadius="lg" boxShadow="lg" bg="white" w={{ base: "90%", md: "400px" }}>
        <Box textAlign="center" mb={4}>
          <img src={logo} alt="signup icon" />
          <Heading size="lg" mt={2}>Sign Up</Heading>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={errors.userType}>
              <Select 
                placeholder="User Type" 
                {...register("userType")}
              >
                <option value="patient">Patient</option>
                <option value="staff">Staff</option>
                <option value="doctor">Doctor</option>
              </Select>
              <FormErrorMessage>{errors.userType?.message}</FormErrorMessage>
            </FormControl>

            <Stack direction="row">
              <FormControl isInvalid={errors.firstName}>
                <Input 
                  placeholder="First Name *" 
                  variant="filled" 
                  {...register("firstName")}
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.lastName}>
                <Input 
                  placeholder="Last Name *" 
                  variant="filled" 
                  {...register("lastName")}
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
            </Stack>

            <FormControl isInvalid={errors.email}>
              <Input 
                placeholder="Email Address *" 
                type="email" 
                variant="filled" 
                {...register("email")}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <Input 
                placeholder="Password *" 
                type="password" 
                variant="filled" 
                {...register("password")}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            {userType === "doctor" && (
              <>
                <FormControl isInvalid={errors.department}>
                  <Input 
                    placeholder="Department *" 
                    variant="filled" 
                    {...register("department")}
                  />
                  <FormErrorMessage>{errors.department?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.speciality}>
                  <Input 
                    placeholder="Speciality *" 
                    variant="filled" 
                    {...register("speciality")}
                  />
                  <FormErrorMessage>{errors.speciality?.message}</FormErrorMessage>
                </FormControl>
              </>
            )}

            <Button 
              type="submit"
              colorScheme="blue" 
              size="lg" 
              _hover={{ bg: "blue.500" }}
              isLoading={signupMutation.isPending}
              loadingText="Signing up..."
              isDisabled={signupMutation.isPending}
            >
              Sign Up
            </Button>

            <Text textAlign="center" fontSize="sm">
              Already have an account?
              <Link to="/">
                <FormLabel color="blue.500" ml={1}>Sign In</FormLabel>
              </Link>
            </Text>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}