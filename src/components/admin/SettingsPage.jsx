import React, { useState } from 'react';
import { DollarSign, Plus, ChevronRight } from 'lucide-react';
const SettingsPage = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
  
        <div className="grid md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input 
                  type="text"
                  defaultValue="Tour Management System"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  defaultValue="admin@tourmanagement.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input 
                  type="tel"
                  defaultValue="+1 234 567 8900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                Save Changes
              </button>
            </div>
          </div>
  
          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive booking updates via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Get urgent alerts via SMS</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-orange-500" />
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                Update Preferences
              </button>
            </div>
          </div>
  
          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                Change Password
              </button>
            </div>
          </div>
  
          {/* Payment Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <DollarSign className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">VNPay</p>
                    <p className="text-sm text-gray-500">Active</p>
                  </div>
                </div>
                <button className="text-green-600 text-sm font-semibold">Connected</button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                    <DollarSign className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-gray-500">Active</p>
                  </div>
                </div>
                <button className="text-green-600 text-sm font-semibold">Connected</button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg border-dashed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <Plus className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Add Payment Method</p>
                    <p className="text-sm text-gray-500">Connect new gateway</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default SettingsPage;  