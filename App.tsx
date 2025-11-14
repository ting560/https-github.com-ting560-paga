import React, { useState, useMemo } from 'react';
import { UserIcon, MailIcon, PhoneIcon, LockIcon, CheckCircleIcon, CreditCardIcon } from './components/icons';
import Input from './components/Input';

type Status = 'idle' | 'submitting' | 'success';

const MERCADO_PAGO_LINK = 'https://mpago.la/31Q3yxR';

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', phone: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório.';
      isValid = false;
    }
    
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Telefone é obrigatório.';
      isValid = false;
    } else {
      // Allows digits, spaces, (), -, and a single leading +
      const phoneRegex = /^\+?[\d\s()-]+$/;
      if (!phoneRegex.test(phoneTrimmed)) {
          newErrors.phone = 'Telefone contém caracteres inválidos.';
          isValid = false;
      } else {
          const justDigits = phoneTrimmed.replace(/\D/g, '');
          if (justDigits.length < 8 || justDigits.length > 15) {
              newErrors.phone = 'O telefone deve conter entre 8 e 15 dígitos.';
              isValid = false;
          }
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido.';
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
      isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setStatus('submitting');
      // Simulate API call and redirect
      setTimeout(() => {
        window.open(MERCADO_PAGO_LINK, '_blank');
        setStatus('success');
      }, 1500);
    }
  };

  const isFormValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const phoneTrimmed = formData.phone.trim();
    // Allows digits, spaces, (), -, and a single leading +
    const isPhoneFormatValid = /^\+?[\d\s()-]+$/.test(phoneTrimmed);
    const phoneDigits = phoneTrimmed.replace(/\D/g, '');
    const isPhoneLengthValid = phoneDigits.length >= 8 && phoneDigits.length <= 15;
    const isPhoneValid = phoneTrimmed !== '' && isPhoneFormatValid && isPhoneLengthValid;

    return (
      formData.name.trim() !== '' &&
      isPhoneValid &&
      emailRegex.test(formData.email.trim()) &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.confirmPassword !== ''
    );
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Product Info Section */}
        <div className="p-8 bg-gray-800/50 flex flex-col justify-center order-2 lg:order-1">
          <h2 className="text-3xl font-bold text-teal-400 mb-2">Portão de Chorinho</h2>
          <p className="text-gray-300 mb-6">Sua entrada para a maior comunidade de Choro do Brasil.</p>
          
          <div className="relative rounded-lg overflow-hidden mb-6">
            <img src="https://picsum.photos/seed/chorinho/600/400" alt="Músicos de Choro" className="w-full h-auto object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="space-y-4 text-gray-200">
            <div className="flex items-start">
              <CheckCircleIcon className="w-6 h-6 text-teal-400 mr-3 mt-1 flex-shrink-0" />
              <p><strong className="font-semibold text-white">Acesso Vitalício:</strong> Pague uma vez e acesse para sempre.</p>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="w-6 h-6 text-teal-400 mr-3 mt-1 flex-shrink-0" />
              <p><strong className="font-semibold text-white">Comunidade Exclusiva:</strong> Conecte-se com músicos e entusiastas.</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">Taxa promocional de acesso</p>
            <p className="text-4xl font-extrabold text-white">R$ 120,00</p>
            <p className="text-sm text-gray-400 mt-1">
              + R$ 50,00/mês para manutenção a partir do segundo mês.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 order-1 lg:order-2">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CheckCircleIcon className="w-20 h-20 text-teal-400 mb-6"/>
              <h2 className="text-2xl font-bold mb-2">Pagamento Aprovado!</h2>
              <h3 className="text-3xl font-bold mb-4 text-teal-400">Conta Criada com Sucesso!</h3>
              <p className="text-gray-300 max-w-sm">
                Enviamos um e-mail para <strong className="text-white">{formData.email}</strong> com seus dados de acesso. Verifique sua caixa de entrada e spam.
              </p>
              <p className="mt-6 text-lg">Seja bem-vindo(a) ao <strong className="text-teal-400">Portão de Chorinho!</strong></p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Crie sua conta para continuar</h2>
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Input
                  id="name"
                  label="Nome Completo"
                  type="text"
                  placeholder="Seu nome e sobrenome"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<UserIcon />}
                  autoComplete="name"
                />
                <Input
                  id="phone"
                  label="Telefone"
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={<PhoneIcon />}
                  autoComplete="tel"
                />
                <Input
                  id="email"
                  label="E-mail de Acesso"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<MailIcon />}
                  autoComplete="email"
                />
                <Input
                  id="password"
                  label="Crie uma Senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<LockIcon />}
                  autoComplete="new-password"
                />
                <Input
                  id="confirmPassword"
                  label="Confirme sua Senha"
                  type="password"
                  placeholder="Repita a senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<LockIcon />}
                  autoComplete="new-password"
                />
                
                <button 
                  type="submit"
                  disabled={!isFormValid || status === 'submitting'}
                  className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 flex items-center justify-center"
                >
                  {status === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5 mr-2" />
                      Pagar com Mercado Pago R$ 120,00
                    </>
                  )}
                </button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-4">
                Ao clicar no botão, você será redirecionado para o ambiente seguro do Mercado Pago para finalizar a compra.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
