import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
  Button,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  Spinner,
  useColorModeValue,
  useToast,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { findUser, EditUser } from '../../apis';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    userType: '',
    fname: '',
    lname: '',
    email: '',
    department: '',
    speciality: '',
    workDays: [],
    time: '',
    fee: ''
  });

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200');
  const buttonTextColor = useColorModeValue('white', 'gray.800');
  const disabledBgColor = useColorModeValue('gray.100', 'gray.700');

  // Fetch user data
  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await findUser({ uid: id });
      return response.data;
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) => EditUser(updatedUser),
    onSuccess: () => {
      toast({
        title: 'User updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Navigate back based on user type
      if (formData.userType.toLowerCase() === 'doctor') {
        navigate('/dashboard/admin/doctors');
      } else {
        navigate('/dashboard/admin/staffs');
      }
    },
    onError: (err) => {
      toast({
        title: 'Failed to update user',
        description: err.message || 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Set form data when user data is loaded
  useEffect(() => {
    if (userData) {
      setFormData({
        userType: userData.userType || '',
        fname: userData.fname || '',
        lname: userData.lname || '',
        email: userData.email || '',
        department: userData.department || '',
        speciality: userData.speciality || '',
        workDays: userData.workDays || [],
        time: userData.time || '',
        fee: userData.fee || ''
      });
    }
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle work days checkbox changes
  const handleWorkDaysChange = (selectedDays) => {
    setFormData({
      ...formData,
      workDays: selectedDays
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create updated user object, preserving the original user type, name, and email
    const updatedUser = {
      ...formData,
      _id: userData._id,
      uid: userData.uid,
      // Preserve original values for locked fields
      userType: userData.userType,
      fname: userData.fname,
      lname: userData.lname,
      email: userData.email
    };
    
    console.log("Submitting update with data:", updatedUser);
    updateUserMutation.mutate(updatedUser);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex justify="center" align="center" h="100vh" direction="column">
        <Text color="red.500" fontSize="lg">Error loading user data</Text>
        <Text color="red.400" fontSize="md">{error?.message || "Please try again"}</Text>
        <Button 
          mt={4} 
          colorScheme="teal" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Flex>
    );
  }

  const isDoctor = formData.userType.toLowerCase() === 'doctor';

  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Flex
        as="nav"
        align="center" 
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={bgColor}
        color="teal.500"
        boxShadow="md"
        mb={8}
      >
        <Heading as="h1" size="lg" letterSpacing="tight">
          Edit {isDoctor ? 'Doctor' : 'Staff'} Details
        </Heading>
        
        <Button 
          onClick={() => navigate(isDoctor ? '/dashboard/admin/doctors' : '/dashboard/admin/staffs')}
          size="sm"
          colorScheme="teal"
        >
          Back
        </Button>
      </Flex>

      <Box 
        bg={bgColor} 
        p={8} 
        borderRadius="md" 
        boxShadow="md" 
        maxW="900px" 
        mx="auto"
      >
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* User Type - Disabled/Read-only */}
            <FormControl>
              <FormLabel>User Type</FormLabel>
              <Input 
                value={formData.userType}
                isReadOnly
                bg={disabledBgColor}
                cursor="not-allowed"
              />
            </FormControl>
            
            {/* Email - Disabled/Read-only */}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input 
                value={formData.email}
                isReadOnly
                bg={disabledBgColor}
                cursor="not-allowed"
              />
            </FormControl>
            
            {/* Full Name - Disabled/Read-only */}
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input 
                value={`${formData.fname} ${formData.lname}`}
                isReadOnly
                bg={disabledBgColor}
                cursor="not-allowed"
              />
            </FormControl>

            {/* Show Work Days for both Doctor and Staff */}
            <FormControl>
              <FormLabel>Work Days</FormLabel>
              <CheckboxGroup 
                value={formData.workDays} 
                onChange={handleWorkDaysChange}
                colorScheme="teal"
              >
                <Stack direction="row" spacing={4} wrap="wrap">
                  <Checkbox value="Sun">Sun</Checkbox>
                  <Checkbox value="Mon">Mon</Checkbox>
                  <Checkbox value="Tue">Tue</Checkbox>
                  <Checkbox value="Wed">Wed</Checkbox>
                  <Checkbox value="Thu">Thu</Checkbox>
                  <Checkbox value="Fri">Fri</Checkbox>
                  <Checkbox value="Sat">Sat</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
            
            {/* Time field for both Doctor and Staff */}
            <FormControl>
              <FormLabel>Time</FormLabel>
              <Input 
                name="time" 
                value={formData.time} 
                onChange={handleInputChange}
                placeholder="e.g. 9AM - 5PM"
              />
            </FormControl>
            
            {/* Doctor-specific fields */}
            {isDoctor && (
              <>
                <FormControl>
                  <FormLabel>Department</FormLabel>
                  <Input 
                    name="department" 
                    value={formData.department} 
                    onChange={handleInputChange}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Speciality</FormLabel>
                  <Input 
                    name="speciality" 
                    value={formData.speciality} 
                    onChange={handleInputChange}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Fee (₹)</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children="₹"
                    />
                    <Input 
                      name="fee" 
                      type="number"
                      value={formData.fee} 
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </FormControl>
              </>
            )}
          </SimpleGrid>
          
          <Flex justify="space-between" mt={8}>
            <Button
              bg="gray.300"
              _hover={{ bg: 'gray.400' }}
              onClick={() => navigate(isDoctor ? '/dashboard/admin/doctors' : '/dashboard/admin/staffs')}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              bg={buttonBgColor}
              color={buttonTextColor}
              _hover={{ bg: 'teal.600' }}
              isLoading={updateUserMutation.isPending}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default EditUserPage;