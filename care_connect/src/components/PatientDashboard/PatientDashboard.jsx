import React, { useEffect, useState } from 'react'
import {
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Avatar, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react'
import { FiLogOut, FiCalendar, FiFileText, FiMessageSquare, FiClipboard } from 'react-icons/fi'
import { FaHospital, FaUserMd, FaPills } from 'react-icons/fa'
import setUserDataInStorage from '../../hooks/userDataSet'
import useUserStore from '../../store/userStore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../store/authStore"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true)
  const user = useUserStore(state => state.user)
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await setUserDataInStorage()
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeDashboard()
  }, [])
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200')
  const buttonTextColor = useColorModeValue('white', 'gray.800')
  const carouselBg = useColorModeValue('teal.50', 'teal.900')
  
  const carouselItems = [
    {
      title: "Welcome to Care Connect",
      description: "Your health is our priority. Book appointments, view prescriptions, and more.",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Book Your Appointment",
      description: "Schedule an appointment with our specialists with just a few clicks.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "View Your Medical Records",
      description: "Access your prescriptions and medical history anytime, anywhere.",
      image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ]
  
  const healthTips = [
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain health.",
      icon: FaUserMd
    },
    {
      title: "Regular Check-ups",
      description: "Schedule regular health check-ups even if you feel healthy.",
      icon: FaHospital
    },
    {
      title: "Take Medications",
      description: "Always complete your prescribed course of medication.",
      icon: FaPills
    }
  ]
  
  if (loading || !user) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Loading dashboard...</Text>
      </Flex>
    )
  }
  
  return (
    <Box minH="100vh" bg="gray.100">
      {/* Navbar */}
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
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing="tight">
            Care Connect
          </Heading>
        </Flex>

        <Flex align="center">
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
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Welcome Message */}
      <Box p={8}>
        <Heading size="xl" mb={2}>Welcome, {user?.fname}!</Heading>
        <Text color="gray.600" mb={8}>What would you like to do today?</Text>
        
        {/* Carousel Section */}
        <Box 
          mb={10} 
          borderRadius="lg" 
          overflow="hidden" 
          boxShadow="lg"
          height="300px"
        >
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000 }}
            style={{ width: '100%', height: '100%' }}
          >
            {carouselItems.map((item, index) => (
              <SwiperSlide key={index}>
                <Box 
                  position="relative" 
                  height="300px" 
                  width="100%"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    backgroundImage={`url(${item.image})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    filter="brightness(0.7)"
                  />
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

        {/* Health Tips */}
        <Heading size="md" mb={6}>Health Tips</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          {healthTips.map((tip, index) => (
            <Card key={index} boxShadow="md">
              <CardBody>
                <Flex direction="column" align="center" textAlign="center">
                  <Icon as={tip.icon} w={12} h={12} color="teal.500" mb={4} />
                  <Heading size="md" mb={2}>{tip.title}</Heading>
                  <Text>{tip.description}</Text>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Button Panels */}
        <Heading size="md" mb={6}>Quick Actions</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiCalendar size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/patient/book-appointment')} 
          >
            Book Appointment
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiClipboard size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/patient/my-appointments')}
          >
            My Appointments
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiFileText size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/patient/prescriptions')}
          >
            Prescriptions
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600' }}
            leftIcon={<FiMessageSquare size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/patient/feedback')}
          >
            Feedback
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default PatientDashboard