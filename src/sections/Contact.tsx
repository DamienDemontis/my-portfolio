import Section from "@/components/common/Section";
import { useTranslation } from "react-i18next";
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useState } from "react";

const socialLinks = [
    { href: 'https://github.com/damiendemontis', icon: FaGithub, label: 'GitHub' },
    { href: 'https://linkedin.com/in/damien-demontis', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'mailto:damien.demontis@epitech.eu', icon: FaEnvelope, label: 'Email' },
];

const Contact = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:damien.demontis@epitech.eu?subject=Contact from Portfolio: ${name}&body=${message}%0D%0A%0D%0AFrom: ${name} (${email})`;
        window.location.href = mailtoLink;
    };


    return (
        <Section id="contact" title={t('contact.title')}>
            <div className="max-w-2xl mx-auto">
                <div className="card bg-base-200 shadow-xl">
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label" htmlFor="name">
                                    <span className="label-text">{t('contact.form_name')}</span>
                                </label>
                                <input id="name" type="text" placeholder="John Doe" className="input input-bordered w-full" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="form-control">
                                <label className="label" htmlFor="email">
                                    <span className="label-text">{t('contact.form_email')}</span>
                                </label>
                                <input id="email" type="email" placeholder="john.doe@example.com" className="input input-bordered w-full" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-control">
                                <label className="label" htmlFor="message">
                                    <span className="label-text">{t('contact.form_message')}</span>
                                </label>
                                <textarea id="message" className="textarea textarea-bordered h-32" placeholder="Your message here..." value={message} onChange={e => setMessage(e.target.value)} required></textarea>
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">{t('contact.form_submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex justify-center gap-6 mt-8">
                    {socialLinks.map(({ href, icon: Icon, label }) => (
                        <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary hover:bg-base-300">
                            <Icon className="h-7 w-7" />
                        </a>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Contact; 