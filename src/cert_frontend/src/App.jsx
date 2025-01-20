import React, { useState } from 'react';

const CertificateGenerator = () => {
  const [certificates, setCertificates] = useState([]);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    commonName: '',
    organization: '',
    organizationalUnit: '',
    country: '',
    state: '',
    locality: '',
    email: '',
    validityDays: 365,
    keySize: 2048
  });

  const keySizes = [1024, 2048, 4096];
  const validityOptions = [
    { days: 30, label: '30 Days' },
    { days: 90, label: '90 Days' },
    { days: 365, label: '1 Year' },
    { days: 730, label: '2 Years' },
    { days: 1095, label: '3 Years' }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateCertificate = () => {
    try {
      const certificate = {
        id: Date.now(),
        serialNumber: Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(''),
        ...formData,
        validFrom: new Date(),
        validTo: new Date(Date.now() + formData.validityDays * 24 * 60 * 60 * 1000),
        fingerprint: Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(':'),
        status: 'valid',
        created: new Date(),
        keyType: 'RSA',
        publicKey: Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      };

      setCertificates(prev => [...prev, certificate]);
      showNotification('Certificate generated successfully');
      
      setFormData(prev => ({
        ...prev,
        commonName: '',
        organization: '',
        organizationalUnit: '',
        email: ''
      }));
    } catch (error) {
      showNotification('Error generating certificate', 'error');
    }
  };

  const revokeCertificate = (id) => {
    setCertificates(prev =>
      prev.map(cert =>
        cert.id === id
          ? { ...cert, status: 'revoked', revokedAt: new Date() }
          : cert
      )
    );
    showNotification('Certificate revoked successfully');
  };

  const deleteCertificate = (id) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
    showNotification('Certificate deleted successfully');
  };

  const exportCertificate = (cert) => {
    const certData = JSON.stringify(cert, null, 2);
    const blob = new Blob([certData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.serialNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Certificate exported successfully');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Certificate Generator</h1>
          <p className="text-lg text-gray-600">Generate and manage digital certificates securely</p>
        </div>

        {notification && (
          <div className="max-w-2xl mx-auto mb-8">
            <div 
              className={`p-4 rounded-lg text-center ${
                notification.type === 'error' 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}
            >
              {notification.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Generate New Certificate</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Common Name*</label>
                  <input
                    type="text"
                    name="commonName"
                    value={formData.commonName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization*</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Example Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organizational Unit</label>
                  <input
                    type="text"
                    name="organizationalUnit"
                    value={formData.organizationalUnit}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="IT Department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="United States"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="California"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="San Francisco"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validity Period</label>
                  <select
                    name="validityDays"
                    value={formData.validityDays}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {validityOptions.map(option => (
                      <option key={option.days} value={option.days}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Size</label>
                  <select
                    name="keySize"
                    value={formData.keySize}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    {keySizes.map(size => (
                      <option key={size} value={size}>
                        {size} bits
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateCertificate}
                disabled={!formData.commonName || !formData.organization}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Generate Certificate
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Generated Certificates ({certificates.length})
            </h2>
            
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {certificates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No certificates generated yet</p>
                  <p className="text-gray-400 text-sm mt-2">Fill out the form to generate your first certificate</p>
                </div>
              ) : (
                certificates.map(cert => (
                  <div 
                    key={cert.id} 
                    className={`border rounded-xl p-6 ${
                      cert.status === 'revoked' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900">{cert.commonName}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportCertificate(cert)}
                          className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                          title="Export"
                        >
                          Export
                        </button>
                        {cert.status !== 'revoked' && (
                          <button
                            onClick={() => revokeCertificate(cert.id)}
                            className="px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
                            title="Revoke"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => deleteCertificate(cert.id)}
                          className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-gray-600">Organization:</div>
                      <div className="text-gray-900">{cert.organization}</div>
                      
                      <div className="text-gray-600">Serial Number:</div>
                      <div className="font-mono text-xs break-all text-gray-900">{cert.serialNumber}</div>
                      
                      <div className="text-gray-600">Status:</div>
                      <div className={cert.status === 'revoked' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </div>
                      
                      <div className="text-gray-600">Valid From:</div>
                      <div className="text-gray-900">{cert.validFrom.toLocaleString()}</div>
                      
                      <div className="text-gray-600">Valid To:</div>
                      <div className="text-gray-900">{cert.validTo.toLocaleString()}</div>
                      
                      <div className="text-gray-600">Key Type/Size:</div>
                      <div className="text-gray-900">{cert.keyType} {cert.keySize} bits</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;