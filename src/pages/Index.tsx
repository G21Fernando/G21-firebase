import AdminLayout from '@/components/layouts/AdminLayout';

const Index = () => {
  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome to G21 Admin</h1>
        <p className="mt-2 text-gray-600">
          Select an option from the navigation to manage your application.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Index;