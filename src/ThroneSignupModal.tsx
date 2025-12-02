// ThroneSignupModal.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ThroneSignupModal: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [paymentMethod, setPaymentMethod] = useState<'bank' | 'crypto' | 'papel' | 'jetbahis' | null>(null);
    const [autoInvoice, setAutoInvoice] = useState(false);

    // NEW: Store throne brands
    const [throneBrands, setThroneBrands] = useState<any[]>([]);

    // Load throne brands dynamically
    useEffect(() => {
      if (!isOpen) return;

      const fetchThroneBrands = async () => {
        const { data, error } = await supabase
          .from('brands')
          .select('id, name, logo_url, group, order')
          .eq('group', 'Throne')
          .order('order', { ascending: true });

        if (!error && data) {
          setThroneBrands(data);
        }
      };

      fetchThroneBrands();
    }, [isOpen]);

      // Close modal on ESC key
      useEffect(() => {
        if (!isOpen) return;
    
        const handler = (e: KeyboardEvent) => {
          if (e.key === "Escape") onClose();
        };
    
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
      }, [isOpen, onClose]);
    
      if (!isOpen) return null;


    return (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={(e) => {
            // Close only when clicking background, not the modal content
            if (e.target === e.currentTarget) onClose();
          }}
        >

            <div className="bg-white w-[95%] max-w-4xl max-h-[90vh] overflow-y-scroll rounded-xl shadow-xl p-8 relative">

                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-black text-2xl"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* TITLE */}
                <h2 className="text-center text-3xl font-semibold mb-2">
                    Create Your Affiliate Account
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Please fill in the form below to create your account for the brands shown below.
                </p>

                {/* LOGOS */}
                <div className="w-full flex flex-wrap justify-center gap-4 md:gap-6 mt-4 mb-8">
                    {throneBrands.map((brand) => (
                        <img
                            key={brand.id}
                            src={brand.logo_url}
                            alt={brand.name}
                            className="h-10 md:h-12 w-auto object-contain flex-shrink-0"
                        />
                    ))}
                </div>

                {/* FORM START */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* EVERYTHING HERE STAYS EXACTLY AS REALM — NO CHANGES */}

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Login username</label>
                        <input className="border rounded p-2" type="text" />
                        <small>Please ensure your username contains only letters, numbers and underscores.</small>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Login password</label>
                        <input className="border rounded p-2" type="password" />
                        <small>Must contain one uppercase letter and one number.</small>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Confirm password</label>
                        <input className="border rounded p-2" type="password" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Email address</label>
                        <input className="border rounded p-2" type="email" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Country</label>
                        <select className="border rounded p-2">
                            <option value="">Select a country</option>
                            <option>Malta</option>
                            <option>Spain</option>
                            <option>Colombia</option>
                            <option>Brazil</option>
                        </select>
                    </div>

                    {/* Newsletter */}
                    <div className="flex items-center gap-2 mt-6">
                        <input type="checkbox" />
                        <label>Email subscription</label>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* First Name</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Last Name</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Date of Birth</label>
                        <input className="border rounded p-2" type="date" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Skype</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Telegram</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Street Address</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">City</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Company</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Phone</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Site URL</label>
                        <input className="border rounded p-2" type="text" />
                    </div>


                    {/* PAYMENT INSTRUCTIONS — SAME AS REALM */}
                    <div className="col-span-2 mt-6">
                        <h3 className="font-semibold mb-2 text-gray-800">Payment Instructions</h3>

                        <label className="font-semibold text-red-600">* Choose a payment method</label>

                        <div className="flex flex-col gap-2 mt-2">

                            {/* Jetbahis Player Account */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'jetbahis'}
                                    onChange={() => setPaymentMethod('jetbahis')}
                                />
                                Jetbahis Player Account
                            </label>

                            {/* Crypto */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'crypto'}
                                    onChange={() => setPaymentMethod('crypto')}
                                />
                                Crypto
                            </label>

                            {/* Papel */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'papel'}
                                    onChange={() => setPaymentMethod('papel')}
                                />
                                Papel
                            </label>

                            {/* Bank Transfer */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'bank'}
                                    onChange={() => setPaymentMethod('bank')}
                                />
                                Bank Wire Transfer
                            </label>
                        </div>

                        {/* JETBAHIS SECTION */}
                        {paymentMethod === 'jetbahis' && (
                            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                                <h4 className="font-semibold text-gray-700 mb-1">
                                    Jetbahis Player Account payment instructions
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">Insert the details</p>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Jetbahis Account Email</label>
                                        <textarea className="border rounded p-2" rows={3}></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CRYPTO SECTION */}
                        {paymentMethod === 'crypto' && (
                            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                                <h4 className="font-semibold text-gray-700 mb-1">
                                    Crypto payment instructions
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Please enter your crypto wallet details. Types accepted BTC, ETH, USDT, USDC.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Method of Payment</label>
                                        <textarea className="border rounded p-2" rows={3}></textarea>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Wallet Address</label>
                                        <textarea className="border rounded p-2" rows={3}></textarea>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Beneficiary Name/Wallet Owner</label>
                                        <textarea className="border rounded p-2" rows={3}></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PAPEL SECTION */}
                        {paymentMethod === 'papel' && (
                            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                                <h4 className="font-semibold text-gray-700 mb-1">
                                    Papel payment instructions
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Please fill in your payment details
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Name Surname</label>
                                        <textarea className="border rounded p-2" rows={3}></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Papel Wallet ID</label>
                                        <textarea className="border rounded p-2" rows={3}></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BANK TRANSFER SECTION */}
                        {paymentMethod === 'bank' && (
                            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                                <h4 className="font-semibold text-gray-700 mb-1">
                                    Bank Wire Transfer payment instructions
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Please enter your bank details
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Account Number</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold">Bank City</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold">Bank Country</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* IBAN</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Bank Name</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold">Bank Other</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Bank Street</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* BIC/ABA/SWIFT Code</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-semibold text-red-600">* Bank Zip/Post Code</label>
                                        <textarea className="border rounded p-2"></textarea>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>

                    {/* Invoicing Options */}
<div className="col-span-2 mt-8">
                    
  <h3 className="font-semibold mb-2 text-gray-800">Invoicing Options</h3>
                    
  <label className="font-semibold text-red-600">* Automatically generate payment invoices?</label>
                    
  <div className="flex items-center gap-2 mt-2">
    <input 
      type="checkbox"
      checked={autoInvoice}
      onChange={() => setAutoInvoice(!autoInvoice)}
    />
    <span className="text-sm">Automatically generate an invoice for each payment</span>
  </div>

  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Biller details */}
    <div className="flex flex-col md:col-span-1">
      <label className="font-semibold text-red-600">* Biller details</label>
      <p className="text-sm text-gray-600 mb-1">
        Invoice header example:<br/>
        Affiliate Inc.<br/>
        123 Example Street,<br/>
        Windsor, 13345.<br/>
        ABN: 123 456 789 0
      </p>
      <textarea 
        className="border rounded p-2 w-full"
        rows={5}
        disabled={!autoInvoice}
      ></textarea>
    </div>

    {/* Default Tax Details */}
    <div className="flex flex-col md:col-span-1">
      
      <h3 className="font-semibold mb-2 text-gray-800 mt-4 md:mt-0">Default tax details</h3>

      <label className="font-semibold text-red-600">* Tax name</label>
      <select 
        className="border rounded p-2 mb-4"
        disabled={!autoInvoice}
      >
        <option value="">Select</option>
        <option value="IVA">IVA</option>
        <option value="GST">GST</option>
        <option value="VAT">VAT</option>
      </select>

      <label className="font-semibold text-red-600">* Tax rate</label>
      <div className="flex items-center gap-2 mb-4">
        <input 
          type="number" 
          className="border rounded p-2 w-full"
          placeholder="0–100"
          disabled={!autoInvoice}
        />
        <span className="font-semibold">%</span>
      </div>

      <label className="font-semibold">Tax note</label>
      <input 
        className="border rounded p-2 mb-2"
        type="text"
        disabled={!autoInvoice}
      />
      <p className="text-sm text-gray-600">
        The tax note will appear beside the tax amount on the generated invoice.
      </p>

    </div>
  </div>
</div>

                                            {/* Terms of use */}
                    <div className="col-span-2 mt-4">
                        <label className="font-semibold text-red-600">* Terms of use</label>
                        <p className="text-sm text-gray-600">
                            Please read the Terms of Use before agreeing.
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" />
                            <label className="text-sm">I agree with the NeatAffiliates Terms of Use</label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="col-span-2 mt-6 flex justify-center">
                        <button
                            type="submit"
                            className="font-semibold bg-purple-700 hover:bg-purple-800 text-white px-10 py-3 rounded-full"
                        >
                            Signup
                        </button>
                    </div>

                                        {/* Support Section */}
                <div className="md:col-span-2 mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-center">Support</h3>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Telegram */}
                    <a
                      href="https://t.me/neat_affiliates"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-lg font-medium"
                    >
                      <span className="text-2xl">📨</span>
                      Telegram: @neat_affiliates
                    </a>

                    {/* Email */}
                    <a
                      href="mailto:support@neataffiliates.com"
                      className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-lg font-medium"
                    >
                      <span className="text-2xl">📧</span>
                      Email: support@neataffiliates.com
                    </a>

                  </div>
                </div>
                </form>
            </div>
        </div>
    );
};

export default ThroneSignupModal;
