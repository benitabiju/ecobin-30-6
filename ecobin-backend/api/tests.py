from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from api.models import User, WasteCategory, PickupRequest, Collector, Feedback

class EcoBinAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.reg_data = {
            'email': 'citizen_test@ecobin.org',
            'password': 'Password123!',
            'full_name': 'Eco Citizen',
            'phone': '+91 98765 43210',
            'address': '123 Green Avenue, Sector 4'
        }

    def test_citizen_registration_success(self):
        response = self.client.post('/api/v1/auth/register/', self.reg_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        user = User.objects.get(email=self.reg_data['email'])
        self.assertEqual(user.role, 'citizen')
        self.assertEqual(user.full_name, self.reg_data['full_name'])

    def test_registration_duplicate_email(self):
        self.client.post('/api/v1/auth/register/', self.reg_data, format='json')
        dup_data = self.reg_data.copy()
        dup_data['phone'] = '+91 98765 43211'
        response = self.client.post('/api/v1/auth/register/', dup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success_and_profile_retrieval(self):
        self.client.post('/api/v1/auth/register/', self.reg_data, format='json')
        login_res = self.client.post('/api/v1/auth/login/', {
            'email': self.reg_data['email'],
            'password': self.reg_data['password']
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_res.data)
        
        # Test /api/v1/users/me/
        token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        me_res = self.client.get('/api/v1/users/me/')
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['email'], self.reg_data['email'])
        self.assertEqual(me_res.data['role'], 'citizen')

    def test_login_invalid_password(self):
        self.client.post('/api/v1/auth/register/', self.reg_data, format='json')
        login_res = self.client.post('/api/v1/auth/login/', {
            'email': self.reg_data['email'],
            'password': 'WrongPassword999!'
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_401_UNAUTHORIZED)


class EcoBinPickupAndFormTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='citizen_pickup@ecobin.org',
            password='Password123!',
            full_name='Green Citizen',
            phone='+91 91234 56789',
            role='citizen'
        )
        login_res = self.client.post('/api/v1/auth/login/', {
            'email': 'citizen_pickup@ecobin.org',
            'password': 'Password123!'
        }, format='json')
        self.token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.category = WasteCategory.objects.create(
            category_name='Recyclable Plastic',
            disposal_category='RECYCLABLE',
            description='Bottles and clean rigid plastic containers'
        )

    def test_list_waste_categories(self):
        res = self.client.get('/api/v1/categories/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data if isinstance(res.data, list) else res.data.get('results', [])
        self.assertTrue(len(data) >= 1)
        self.assertEqual(data[0]['category_name'], 'Recyclable Plastic')

    def test_create_pickup_request_submission(self):
        fake_image = SimpleUploadedFile('waste.jpg', b'image_content_bytes', content_type='image/jpeg')
        payload = {
            'category': str(self.category.category_id),
            'quantity': '4.2',
            'pickup_date': '2026-11-10',
            'address': '77 Market Road, Bengaluru',
            'street': 'Market Road',
            'landmark': 'Opposite City Library',
            'description': '3 bags of sorted plastic',
            'latitude': '12.9716',
            'longitude': '77.5946',
            'images': [fake_image]
        }
        res = self.client.post('/api/v1/pickups/', payload, format='multipart')
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertEqual(res.data['status'], 'pending_assignment')
        self.assertEqual(float(res.data['quantity']), 4.2)
        self.assertEqual(res.data['address'], payload['address'])

    def test_citizen_recycling_history_endpoint(self):
        res = self.client.get('/api/v1/recycling/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_feedback_submission_on_completed_pickup(self):
        # Create a completed pickup requiring rating
        pickup = PickupRequest.objects.create(
            user=self.user,
            category=self.category,
            quantity=3.0,
            pickup_date='2026-10-25',
            status='completed',
            pending_rating=True
        )
        res = self.client.post(
            f'/api/v1/pickups/{pickup.request_id}/submit_feedback/',
            {'rating': 5, 'comments': 'Prompt and clean pickup!'},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        pickup.refresh_from_db()
        self.assertFalse(pickup.pending_rating)
        feedback = Feedback.objects.filter(request=pickup).first()
        self.assertIsNotNone(feedback)
        self.assertEqual(feedback.rating, 5)
