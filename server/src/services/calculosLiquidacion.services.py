import sys
import json
from datetime import datetime

def calcular_valores_automaticos(detalle, parametro, novedad):
    try:
        # Validar que todos los campos requeridos estén presentes
        campos_requeridos = ['idEmpleado', 'salario', 'diasTrabajados', 'horasExtras', 'tipoContrato', 'fechaRegistro']
        for campo in campos_requeridos:
            if campo not in detalle:
                raise KeyError(f"Falta el campo requerido: {campo}")

        # Convertir strings a números si es necesario
        id_empleado = int(detalle["idEmpleado"])
        salario = float(detalle["salario"])
        dias_trabajados = int(detalle["diasTrabajados"])
        horas_extras = int(detalle["horasExtras"])
        tipo_contrato = detalle["tipoContrato"]
        fecha_registro = detalle["fechaRegistro"]
        mes_liquidacion = datetime.strptime(fecha_registro, "%Y-%m-%d").month

        # Resto de tus cálculos...
        salario_minimo = float(parametro["salarioMinimo"])
        salud = salario * float(parametro["salud"])
        pension = salario * float(parametro["pension"])
        aux_transporte = float(parametro["auxTransporte"]) if salario <= 2 * salario_minimo else 0
        aux_alimentacion = salario / dias_trabajados
        bonificacion_servicio = 0
        prima_servicios = 0
        prima_navidad = 0
        vacaciones = 0
        cesantias = 0
        intereses_cesantias = 0

        interesesFijos = float(novedad["intereses"]) 
        meses = int(novedad["meses"])
        prestamo = float(novedad["prestamos"])

        # Cálculo del primer pago del primer mes (incluye pago1 y pago2)
        pago1 = prestamo * (interesesFijos / meses)
        invertirInteresesFijo = interesesFijos / 100
        pago2 = prestamo * invertirInteresesFijo
        primer_mes_pago = pago1 + pago2  # Primer mes incluye pago1 y pago2

        # Lista de pagos por mes
        pagos_por_mes = [primer_mes_pago]  # Agrega el primer mes

        # Para los meses siguientes, solo se considera pago2
        for mes in range(1, meses):
            pagos_por_mes.append(pago2)

        # Solo para el primer mes se toma el primer pago completo
        prestamos = primer_mes_pago  # O usa sum(pagos_por_mes) si quieres el total

        calcularPagoDescuento = float(novedad["descuentos"]) * 0.5
        descuentos = calcularPagoDescuento
        valor_horas_extra = (salario / 240) * 1.25 * horas_extras if horas_extras > 0 else 0

        if tipo_contrato in ["TERMINO FIJO", "TERMINO INDEFINIDO"]:
            bonificacion_servicio = salario * 0.5 if salario < 1400000 else 0

            if mes_liquidacion in [6, 12]:
                prima_servicios = (salario * dias_trabajados) / 360

            if mes_liquidacion == 12:
                prima_navidad = salario * (dias_trabajados / 360)

            vacaciones = (salario * dias_trabajados) / 720
            cesantias = (salario * dias_trabajados) / 360
            intereses_cesantias = cesantias * 0.12

        devengado = (salario - salud - pension  - prestamos - descuentos + aux_transporte + bonificacion_servicio +
                    aux_alimentacion + prima_servicios + prima_navidad + valor_horas_extra +
                    cesantias + intereses_cesantias + vacaciones)

        return {
            "idEmpleado": id_empleado,
            "salud": salud,
            "pension": pension,
            "auxTransporte": aux_transporte,
            "bonificacionServicio": bonificacion_servicio,
            "auxAlimentacion": aux_alimentacion,
            "primaNavidad": prima_navidad,
            "vacaciones": vacaciones,
            "cesantias": cesantias,
            "interesesCesantias": intereses_cesantias,
            "prestamos": prestamos,
            "descuentos": descuentos,
            "devengado": devengado,
        }

    except KeyError as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error de conversión de datos: {str(e)}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error inesperado: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    try:
        if len(sys.argv) < 4:
            print("Error: No se proporcionaron datos de entrada", file=sys.stderr)
            sys.exit(1)
        
        detalle = json.loads(sys.argv[1])
        parametro = json.loads(sys.argv[2])
        novedad = json.loads(sys.argv[3])
        result = calcular_valores_automaticos(detalle, parametro, novedad)
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        print(f"Error al decodificar JSON: {str(e)}", file=sys.stderr)
        sys.exit(1)