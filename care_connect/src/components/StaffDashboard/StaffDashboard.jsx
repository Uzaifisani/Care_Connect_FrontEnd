// care_connect/src/components/StaffDashboard/StaffDashboard.jsx
import React, { useEffect, useState } from 'react'
import {
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid, 
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Avatar
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../store/authStore"
import useUserStore from '../../store/userStore' // Assuming you have a user store
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import setUserDataInStorage from '../../hooks/userDataSet'
import { FiLogOut } from 'react-icons/fi'

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { logout } = useAuth()
  const user = useUserStore(state => state.user) // Accessing user details

  useEffect(() => {
    // Simulate loading data
    const initializeDashboard = async () => {
      try {
        await setUserDataInStorage();
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeDashboard()
  }, [])

  const bgColor = useColorModeValue('white', 'gray.800')
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200')
  const buttonTextColor = useColorModeValue('white', 'gray.800')

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Loading dashboard...</Text>
      </Flex>
    )
  }

  // Carousel items
  const carouselItems = [
    {
      title: "Welcome to the Staff Dashboard",
      description: "Manage patient registrations, scheduling, and payments efficiently.",
      image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Stay Organized",
      description: "Keep track of your tasks and patient information in one place.",
      image: "https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      title: "Efficient Workflows",
      description: "Streamline your processes for better patient care.",
      image: "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ]

  return (
    <Box minH="100vh" bg="gray.100">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={bgColor}
        color="teal.500"
        boxShadow="md"
      >
        <Heading as="h1" size="lg" letterSpacing="tight">
          Staff Dashboard
        </Heading>
        <Flex>
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <HStack>
                <Avatar 
                  size="sm" 
                  name={`${user?.email || ''}`} 
                />
                <Text>{user?.email}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/dashboard/change-password')}>
                Change Password
              </MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Box p={8}>
        <Heading size="xl" mb={6}>Welcome, {user?.fname} {user?.lname}!</Heading> {/* Displaying user name */}

        {/* Carousel Section */}
        <Box mb={10} borderRadius="lg" overflow="hidden" boxShadow="lg">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            style={{ width: '100%', height: '300px' }}
          >
            {carouselItems.map((item, index) => (
              <SwiperSlide key={index}>
                <Box 
                  position="relative" 
                  height="300px" 
                  width="100%"
                  backgroundImage={`url(${item.image})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  filter="brightness(0.7)"
                >
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    textAlign="center"
                    color="white"
                    p={8}
                  >
                    <Heading size="xl" mb={4}>{item.title}</Heading>
                    <Text fontSize="lg" maxW="700px">{item.description}</Text>
                  </Flex>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Panels Section */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            onClick={() => navigate('staff/register-patient')}
          >
            Register New Patient
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            onClick={() => navigate('staff/all-patients')}
          >
            View All Patients
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            onClick={() => navigate('staff/make-payment')}
          >
            Make Payment
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default StaffDashboard