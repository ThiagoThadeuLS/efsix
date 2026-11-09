import Container from '@/components/ui/container';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020202]">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold tracking-[0.3em] uppercase">
              EFSIX
            </h2>
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500 mt-1">
              Built as Armour
            </p>
            <p className="text-sm text-gray-400 mt-4 max-w-sm leading-relaxed">
              Mais que esporte. Propósito. Tecnologia de ponta e design brutalista
              para quem levanta o nível do desempenho.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              {['Home', 'Produtos', 'Sobre', 'Contato'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold mb-4">
              Suporte
            </h3>
            <ul className="space-y-2">
              {['Trocas e Devoluções', 'Política de Privacidade', 'Termos de Uso', 'FAQ'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 tracking-wider">
            © 2026 EFSIX — Built as Armour. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs tracking-wider uppercase">
              Instagram
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs tracking-wider uppercase">
              TikTok
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
