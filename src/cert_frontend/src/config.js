export const idlFactory = ({ IDL }) => {
  const CertificateData = IDL.Record({
    'id': IDL.Text,
    'recipientName': IDL.Text,
    'courseName': IDL.Text,
    'issueDate': IDL.Int,
    'issuerName': IDL.Text,
    'description': IDL.Text,
  });
  
  return IDL.Service({
    'hello': IDL.Func([], [IDL.Text], ['query']),
    'createCertificate': IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [IDL.Text],
      [],
    ),
  });
};

export const canisterId = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
