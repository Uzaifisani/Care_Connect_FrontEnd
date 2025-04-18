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
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react'
import { FiLogOut, FiCalendar, FiFileText, FiMessageSquare, FiClipboard, FiUsers, FiAward } from 'react-icons/fi'
import { FaHospital, FaUserMd, FaPrescriptionBottleAlt, FaFileMedical } from 'react-icons/fa'
import setUserDataInStorage from '../../hooks/userDataSet'
import useUserStore from '../../store/userStore'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../store/authStore"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { DoctorsStats } from '../../apis'

const DoctorDashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useUserStore(state => state.user)
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await setUserDataInStorage()
        console.log(user?.uid);
        const response = await DoctorsStats(user?.uid)
        setStats(response.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeDashboard()
  }, [user?.uid])
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const buttonBgColor = useColorModeValue('teal.500', 'teal.200')
  const buttonTextColor = useColorModeValue('white', 'gray.800')
  const carouselBg = useColorModeValue('teal.50', 'teal.900')
  const statBgColor = useColorModeValue('white', 'gray.700')
  
  const carouselItems = [
    {
      title: "Welcome to Doctor Portal",
      description: "Manage your appointments, prescriptions, and patient feedback all in one place.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Your Appointments",
      description: "View and manage your upcoming appointments with patients.",
      image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Patient Prescriptions",
      description: "Easily create, view and manage prescriptions for your patients.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ]
  
  const resources = [
    {
      title: "Medical Research",
      description: "Access the latest medical journals and research papers.",
      icon: FaFileMedical
    },
    {
      title: "Best Practices",
      description: "Stay updated with medical best practices and guidelines.",
      icon: FaUserMd
    },
    {
      title: "Continued Education",
      description: "Explore opportunities for professional development.",
      icon: FiAward
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
            Doctor Portal
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

      {/* Main Content */}
      <Box p={8}>
        {/* Welcome Section */}
        <Heading size="xl" mb={2}>Welcome, Dr. {user?.fname} {user?.lname}!</Heading>
        <Text color="gray.600" mb={8}>Here's an overview of your medical practice</Text>
        
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
        
        {/* Stats Section */}
        <Heading size="md" mb={6}>Your Practice Overview</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              bg={statBgColor} 
              boxShadow="md" 
              borderRadius="lg"
              _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s' }}
            >
              <CardBody>
                <Flex align="center">
                  <Icon 
                    as={
                      stat.subheading === "Appointments Fulfilled" ? FiCalendar :
                      stat.subheading === "Unique Patients Consulted" ? FiUsers :
                      stat.subheading === "Total Revenue Generated" ? FaHospital :
                      stat.subheading === "Feedbacks Received" ? FiMessageSquare :
                      stat.subheading === "Average Rating" ? FiAward : FaUserMd
                    } 
                    w={12} 
                    h={12} 
                    color="teal.500" 
                    mr={4} 
                  />
                  <Stat>
                    <StatLabel fontSize="lg">{stat.subheading}</StatLabel>
                    <StatNumber fontSize="3xl">{stat.heading}</StatNumber>
                  </Stat>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        
        {/* Medical Resources */}
        <Heading size="md" mb={6}>Medical Resources</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          {resources.map((resource, index) => (
            <Card key={index} boxShadow="md" _hover={{ transform: 'translateY(-5px)', transition: 'transform 0.3s' }}>
              <CardBody>
                <Flex direction="column" align="center" textAlign="center">
                  <Icon as={resource.icon} w={12} h={12} color="teal.500" mb={4} />
                  <Heading size="md" mb={2}>{resource.title}</Heading>
                  <Text>{resource.description}</Text>
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
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            leftIcon={<FiCalendar size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/appointments')} 
            transition="all 0.3s"
            boxShadow="md"
          >
            Appointments
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            leftIcon={<FiFileText size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/upload-prescription')}
            transition="all 0.3s"
            boxShadow="md"
          >
            Upload Prescription
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            leftIcon={<FiMessageSquare size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/feedbacks')}
            transition="all 0.3s"
            boxShadow="md"
          >
            Feedbacks
          </Button>
          <Button
            size="lg"
            height="100px"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: 'teal.600', transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            leftIcon={<FiClipboard size="24px" />}
            justifyContent="flex-start"
            fontWeight="bold"
            onClick={() => navigate('/dashboard/doctor/view-prescriptions')}
            transition="all 0.3s"
            boxShadow="md"
          >
            View Prescriptions
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default DoctorDashboard