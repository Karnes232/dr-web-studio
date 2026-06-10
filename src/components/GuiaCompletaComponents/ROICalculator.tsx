"use client"
import { Link } from "@/i18n/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  ShoppingCart,
  Zap,
  Calculator,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

interface ROICalculatorProps {
  language?: "en" | "es"
}

export function ROICalculator({ language = "es" }: ROICalculatorProps) {
  // Input values
  const [monthlyVisitors, setMonthlyVisitors] = useState(10000)
  const [conversionRate, setConversionRate] = useState(2)
  const [averageOrderValue, setAverageOrderValue] = useState(100)
  const [currentBounceRate, setCurrentBounceRate] = useState(60)

  const labels = {
    es: {
      title: "Calculadora de ROI",
      subtitle: "Descubre el impacto financiero de modernizar tu sitio web",
      inputs: {
        visitors: "Visitantes Mensuales",
        conversion: "Tasa de Conversión Actual",
        orderValue: "Valor Promedio de Orden",
        bounceRate: "Tasa de Rebote Actual",
      },
      improvements: {
        title: "Mejoras Esperadas",
        loadTime: "Tiempo de Carga",
        bounce: "Tasa de Rebote",
        conversion: "Conversiones",
        seo: "Tráfico Orgánico",
      },
      results: {
        title: "Resultados Proyectados",
        monthly: "Ingreso Mensual Adicional",
        annual: "Ingreso Anual Adicional",
        newCustomers: "Nuevos Clientes/Mes",
        payback: "Período de Recuperación",
        roi: "ROI a 12 Meses",
      },
      metrics: {
        current: "Actual",
        optimized: "Optimizado",
        improvement: "Mejora",
      },
      cta: "Solicitar Análisis Personalizado",
      disclaimer:
        "* Estimaciones basadas en promedios de la industria. Resultados reales pueden variar.",
    },
    en: {
      title: "ROI Calculator",
      subtitle: "Discover the financial impact of modernizing your website",
      inputs: {
        visitors: "Monthly Visitors",
        conversion: "Current Conversion Rate",
        orderValue: "Average Order Value",
        bounceRate: "Current Bounce Rate",
      },
      improvements: {
        title: "Expected Improvements",
        loadTime: "Load Time",
        bounce: "Bounce Rate",
        conversion: "Conversions",
        seo: "Organic Traffic",
      },
      results: {
        title: "Projected Results",
        monthly: "Additional Monthly Revenue",
        annual: "Additional Annual Revenue",
        newCustomers: "New Customers/Month",
        payback: "Payback Period",
        roi: "12-Month ROI",
      },
      metrics: {
        current: "Current",
        optimized: "Optimized",
        improvement: "Improvement",
      },
      cta: "Request Personalized Analysis",
      disclaimer:
        "* Estimates based on industry averages. Actual results may vary.",
    },
  }

  const t = labels[language]

  // Calculations
  const currentMonthlyRevenue =
    monthlyVisitors * (conversionRate / 100) * averageOrderValue

  // Conservative improvement estimates
  const bounceImprovement = Math.min(currentBounceRate * 0.3, 20) // 30% reduction, max 20 points
  const newBounceRate = currentBounceRate - bounceImprovement

  const conversionImprovement = 0.5 // 0.5 percentage points increase
  const newConversionRate = conversionRate + conversionImprovement

  const trafficIncrease = 0.15 // 15% increase from SEO improvements
  const newMonthlyVisitors = monthlyVisitors * (1 + trafficIncrease)

  const optimizedMonthlyRevenue =
    newMonthlyVisitors * (newConversionRate / 100) * averageOrderValue
  const additionalMonthlyRevenue =
    optimizedMonthlyRevenue - currentMonthlyRevenue
  const additionalAnnualRevenue = additionalMonthlyRevenue * 12

  const newCustomersPerMonth =
    newMonthlyVisitors * (newConversionRate / 100) -
    monthlyVisitors * (conversionRate / 100)

  // Typical modern website investment: $15,000 - $30,000
  const estimatedInvestment = 20000
  const paybackMonths = estimatedInvestment / additionalMonthlyRevenue
  const roi12Months =
    ((additionalAnnualRevenue - estimatedInvestment) / estimatedInvestment) *
    100

  // Improvement metrics
  const improvements = [
    {
      label: t.improvements.loadTime,
      current: "5-8s",
      optimized: "<2s",
      improvement: "70%",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: t.improvements.bounce,
      current: `${currentBounceRate}%`,
      optimized: `${Math.round(newBounceRate)}%`,
      improvement: `-${Math.round(bounceImprovement)}%`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: t.improvements.conversion,
      current: `${conversionRate}%`,
      optimized: `${newConversionRate.toFixed(1)}%`,
      improvement: `+${conversionImprovement.toFixed(1)}%`,
      icon: ShoppingCart,
      color: "from-teal-500 to-teal-400",
    },
    {
      label: t.improvements.seo,
      current: "100%",
      optimized: "115%",
      improvement: "+15%",
      icon: Users,
      color: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6"
          >
            <Calculator className="w-4 h-4" />
            {language === "es"
              ? "Calculadora Interactiva"
              : "Interactive Calculator"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900"
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Input Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {language === "es"
                    ? "Datos de Tu Negocio"
                    : "Your Business Data"}
                </h3>

                {/* Monthly Visitors */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t.inputs.visitors}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="100"
                      max="100000"
                      step="100"
                      value={monthlyVisitors}
                      onChange={e => setMonthlyVisitors(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-2xl font-bold text-orange-700 dark:text-orange-400 min-w-[120px] text-right">
                      {monthlyVisitors.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t.inputs.conversion}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={conversionRate}
                      onChange={e => setConversionRate(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400 min-w-[120px] text-right">
                      {conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t.inputs.orderValue}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={averageOrderValue}
                      onChange={e =>
                        setAverageOrderValue(Number(e.target.value))
                      }
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-2xl font-bold text-teal-700 dark:text-teal-400 min-w-[120px] text-right">
                      ${averageOrderValue}
                    </span>
                  </div>
                </div>

                {/* Bounce Rate */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    {t.inputs.bounceRate}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="20"
                      max="80"
                      step="1"
                      value={currentBounceRate}
                      onChange={e =>
                        setCurrentBounceRate(Number(e.target.value))
                      }
                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-2xl font-bold text-orange-700 dark:text-orange-400 min-w-[120px] text-right">
                      {currentBounceRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Improvements Card */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-3xl border-2 border-orange-200 dark:border-orange-800 p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-orange-700 dark:text-orange-400" />
                  {t.improvements.title}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {improvements.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800"
                      >
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} mb-3`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          {item.label}
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {item.improvement}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Results Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-3xl border-2 border-green-200 dark:border-green-800 p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {t.results.title}
                </h3>

                {/* Monthly Revenue */}
                <div className="mb-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-green-300 dark:border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {t.results.monthly}
                    </span>
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                    $
                    {additionalMonthlyRevenue.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === "es" ? "por mes" : "per month"}
                  </div>
                </div>

                {/* Annual Revenue */}
                <div className="mb-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {t.results.annual}
                    </span>
                    <Calendar className="w-5 h-5 text-orange-700 dark:text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">
                    $
                    {additionalAnnualRevenue.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === "es" ? "por año" : "per year"}
                  </div>
                </div>

                {/* New Customers */}
                <div className="mb-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {t.results.newCustomers}
                    </span>
                    <Users className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                  </div>
                  <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                    +{Math.round(newCustomersPerMonth)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === "es"
                      ? "clientes adicionales"
                      : "additional customers"}
                  </div>
                </div>

                {/* ROI Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {t.results.payback}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {paybackMonths.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {language === "es" ? "meses" : "months"}
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {t.results.roi}
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {roi12Months.toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      ROI
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/project-planner">
                <motion.div
                  className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold text-lg overflow-hidden shadow-2xl shadow-orange-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">{t.cta}</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
              {/* Disclaimer */}
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
                {t.disclaimer}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #f97316, #eab308);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #f97316, #eab308);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </section>
  )
}

export default ROICalculator
