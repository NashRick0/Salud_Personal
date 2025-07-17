import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
    // --- Contenedores Principales ---
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 24,
    },
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8fafc',
    },
    
    // --- Encabezados y Texto ---
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 24,
        fontFamily: 'System',
    },
    
    // --- Tarjetas ---
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    cardTitle: { 
        fontSize: 20, 
        fontWeight: '600', 
        marginLeft: 12, 
        color: '#1e293b',
        fontFamily: 'System',
    },
    cardBody: { 
        alignItems: 'center',
        paddingVertical: 16,
    },
    cardValue: { 
        fontSize: 48, 
        fontWeight: '700', 
        color: '#3498db',
        fontFamily: 'System',
        textShadowColor: 'rgba(52, 152, 219, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    cardUnit: { 
        fontSize: 20, 
        color: '#64748b',
        marginTop: 4,
        fontFamily: 'System',
    },
    cardGoal: { 
        fontSize: 16, 
        color: '#94a3b8', 
        marginTop: 8,
        fontFamily: 'System',
    },
    cardFooter: { 
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16,
    },
    
    // --- Formularios y Botones ---
    formContainer: { 
        flexDirection: 'row', 
        marginBottom: 24,
        width: '100%',
    },
    input: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginRight: 12,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        color: '#1e293b',
        fontFamily: 'System',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
        shadowColor: '#3498db',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: { 
        color: '#ffffff', 
        fontSize: 16, 
        fontWeight: '600',
        fontFamily: 'System',
    },
    
    // --- Gráficos y Progreso ---
    progressBarContainer: { 
        height: 12, 
        width: '100%', 
        backgroundColor: '#f1f5f9', 
        borderRadius: 8, 
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBarFill: { 
        height: '100%', 
        backgroundColor: '#2ecc71', 
        borderRadius: 8,
    },
    chartContainer: { 
        flexDirection: 'row', 
        alignItems: 'flex-end', 
        justifyContent: 'space-between', 
        marginTop: 24, 
        paddingBottom: 16,
        borderBottomWidth: 1, 
        borderBottomColor: '#f1f5f9',
    },
    barWrapper: { 
        alignItems: 'center',
        width: '14%',
    },
    bar: { 
        width: '70%', 
        backgroundColor: '#3498db', 
        borderRadius: 6,
        marginBottom: 4,
    },
    barLabel: { 
        fontSize: 12, 
        color: '#64748b',
        marginTop: 6,
    },
    goalLine: { 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        height: 2, 
        backgroundColor: '#e74c3c', 
        borderStyle: 'dashed',
    },
    statsText: { 
        textAlign: 'center', 
        marginTop: 20, 
        fontSize: 16, 
        color: '#334155',
        fontFamily: 'System',
    },
    
    // --- Pantalla de Login ---
    loginContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 32,
        backgroundColor: '#f8fafc',
    },
    loginTitle: { 
        fontSize: 42, 
        fontWeight: '800', 
        color: '#1e293b', 
        marginBottom: 8,
        fontFamily: 'System',
    },
    loginSubtitle: { 
        fontSize: 18, 
        color: '#64748b', 
        marginBottom: 48, 
        textAlign: 'center',
        lineHeight: 28,
        fontFamily: 'System',
    },
    loginInput: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        marginBottom: 20,
        color: '#1e293b',
        fontFamily: 'System',
    },
    
    // --- Pantalla de Perfil ---
    profileText: { 
        fontSize: 18, 
        marginBottom: 12, 
        color: '#334155', 
        lineHeight: 28,
        fontFamily: 'System',
    },
    label: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 8,
        alignSelf: 'flex-start',
        fontWeight: '500',
        fontFamily: 'System',
    },
    profileInput: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        marginBottom: 20,
        color: '#1e293b',
        fontFamily: 'System',
    },
    
    // --- Nuevos estilos ---
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
    },
    secondaryButtonText: {
        color: '#334155',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'System',
    },
    linkText: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        fontFamily: 'System',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        marginTop: 4,
        alignSelf: 'flex-start',
        fontFamily: 'System',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 8,
        fontWeight: '500',
        fontFamily: 'System',
    },
});
