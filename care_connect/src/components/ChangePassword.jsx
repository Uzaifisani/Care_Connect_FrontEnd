import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { ChangePassword as ChangePasswordAPI } from '../apis';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

const ChangePassword = () => {
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuth();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (!user?.email) {
      navigate('/login');
    }
  }, [user, navigate]);

  const mutation = useMutation({
    mutationFn: (data) => ChangePasswordAPI(data),
    onSuccess: () => {
      toast({
        title: 'Password changed successfully',
        description: 'Please login again with your new password',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      logout();
      navigate('/login');
    },
    onError: (error) => {
      toast({
        title: 'Error changing password',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      email: user.email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg="gray.100" py={12}>
      <Container maxW="container.md">
        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="lg">
          <Heading mb={6} textAlign="center" color="teal.500">
            Change Password
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={user?.email || ''}
                  isDisabled
                  bg="gray.100"
                />
              </FormControl>

              <FormControl isInvalid={errors.currentPassword}>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  {...register('currentPassword', {
                    required: 'Current password is required',
                  })}
                />
              </FormControl>

              <FormControl isInvalid={errors.newPassword}>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
              </FormControl>

              <FormControl isInvalid={errors.confirmPassword}>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watch('newPassword') || 'Passwords do not match',
                  })}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                w="100%"
                isLoading={mutation.isPending}
              >
                Change Password
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
